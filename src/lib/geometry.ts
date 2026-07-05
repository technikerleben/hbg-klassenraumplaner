import type { ObjectShape, PlannerObject, RoomGeometry, WallSide } from '../types/planner';

export interface Point { x: number; y: number }
export interface ObjectSnapResult { xCm: number; yCm: number; snappedX: boolean; snappedY: boolean }

export const degToRad = (deg: number) => (deg * Math.PI) / 180;
export const normalizeAngle = (deg: number) => ((deg % 360) + 360) % 360;
export const snap = (value: number, step: number) => step <= 1 ? Math.round(value) : Math.round(value / step) * step;

export function rotatePoint(point: Point, center: Point, angleDeg: number): Point {
  const angle = degToRad(angleDeg);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return { x: center.x + dx * cos - dy * sin, y: center.y + dx * sin + dy * cos };
}

export function resolveObjectShape(object: PlannerObject): ObjectShape {
  if (object.shape) return object.shape;
  if (object.catalogId === 'desk-trapezoid') return 'trapezoid';
  if (['desk-group-round', 'stool', 'plant', 'waste-bin'].includes(object.catalogId)) return 'round';
  if (object.catalogId === 'beanbag') return 'ellipse';
  if (object.catalogId === 'bench') return 'bench';
  if (object.catalogId === 'acoustic-sofa') return 'sofa';
  return 'rect';
}

export function trapezoidPoints(widthCm: number, depthCm: number): number[] {
  const halfW = widthCm / 2;
  const halfD = depthCm / 2;
  const shortHalf = widthCm / 4;
  return [
    -halfW, halfD,
    halfW, halfD,
    shortHalf, -halfD,
    -shortHalf, -halfD,
  ];
}

function localPolygon(object: PlannerObject, inflate = 0): Point[] {
  const halfW = object.widthCm / 2 + inflate;
  const halfH = object.depthCm / 2 + inflate;
  if (resolveObjectShape(object) === 'trapezoid') {
    const shortHalf = object.widthCm / 4 + inflate;
    return [
      { x: -halfW, y: halfH },
      { x: halfW, y: halfH },
      { x: shortHalf, y: -halfH },
      { x: -shortHalf, y: -halfH },
    ];
  }
  return [
    { x: -halfW, y: -halfH },
    { x: halfW, y: -halfH },
    { x: halfW, y: halfH },
    { x: -halfW, y: halfH },
  ];
}

export function objectCorners(object: PlannerObject, inflate = 0): Point[] {
  const center = { x: object.xCm, y: object.yCm };
  return localPolygon(object, inflate)
    .map((point) => ({ x: point.x + center.x, y: point.y + center.y }))
    .map((point) => rotatePoint(point, center, object.rotationDeg));
}

export function objectBounds(object: PlannerObject) {
  const points = objectCorners(object);
  return {
    minX: Math.min(...points.map((p) => p.x)),
    maxX: Math.max(...points.map((p) => p.x)),
    minY: Math.min(...points.map((p) => p.y)),
    maxY: Math.max(...points.map((p) => p.y)),
  };
}

function axesFor(poly: Point[]): Point[] {
  return poly.map((point, index) => {
    const next = poly[(index + 1) % poly.length];
    const edge = { x: next.x - point.x, y: next.y - point.y };
    const length = Math.hypot(edge.x, edge.y) || 1;
    return { x: -edge.y / length, y: edge.x / length };
  });
}

function project(poly: Point[], axis: Point) {
  const dots = poly.map((p) => p.x * axis.x + p.y * axis.y);
  return { min: Math.min(...dots), max: Math.max(...dots) };
}

export function polygonsIntersect(a: Point[], b: Point[]): boolean {
  for (const axis of [...axesFor(a), ...axesFor(b)]) {
    const pa = project(a, axis);
    const pb = project(b, axis);
    if (pa.max <= pb.min || pb.max <= pa.min) return false;
  }
  return true;
}

export function objectsIntersect(a: PlannerObject, b: PlannerObject, inflateA = 0, inflateB = 0) {
  return polygonsIntersect(objectCorners(a, inflateA), objectCorners(b, inflateB));
}

export function objectInsideRoom(object: PlannerObject, room: RoomGeometry) {
  const epsilon = 0.05;
  return objectCorners(object).every((p) => p.x >= -epsilon && p.y >= -epsilon && p.x <= room.widthCm + epsilon && p.y <= room.lengthCm + epsilon);
}

export function clampObjectToRoom(object: PlannerObject, room: RoomGeometry): Pick<PlannerObject, 'xCm' | 'yCm'> {
  const points = objectCorners(object);
  const offsetsX = points.map((p) => p.x - object.xCm);
  const offsetsY = points.map((p) => p.y - object.yCm);
  const minOffsetX = Math.min(...offsetsX);
  const maxOffsetX = Math.max(...offsetsX);
  const minOffsetY = Math.min(...offsetsY);
  const maxOffsetY = Math.max(...offsetsY);
  const minCenterX = -minOffsetX;
  const maxCenterX = room.widthCm - maxOffsetX;
  const minCenterY = -minOffsetY;
  const maxCenterY = room.lengthCm - maxOffsetY;
  return {
    xCm: minCenterX > maxCenterX ? room.widthCm / 2 : Math.max(minCenterX, Math.min(maxCenterX, object.xCm)),
    yCm: minCenterY > maxCenterY ? room.lengthCm / 2 : Math.max(minCenterY, Math.min(maxCenterY, object.yCm)),
  };
}

function bestSnapDelta(candidates: number[], threshold: number) {
  const eligible = candidates.filter((value) => Math.abs(value) <= threshold);
  if (!eligible.length) return undefined;
  return eligible.reduce((best, value) => Math.abs(value) < Math.abs(best) ? value : best);
}

export function snapObjectToObjects(
  moving: PlannerObject,
  others: PlannerObject[],
  thresholdCm = 8,
): ObjectSnapResult {
  const movingBounds = objectBounds(moving);
  const movingCenterX = (movingBounds.minX + movingBounds.maxX) / 2;
  const movingCenterY = (movingBounds.minY + movingBounds.maxY) / 2;
  const xCandidates: number[] = [];
  const yCandidates: number[] = [];

  for (const other of others) {
    if (other.id === moving.id || other.kind === 'zone' || other.kind === 'symbol') continue;
    const bounds = objectBounds(other);
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    xCandidates.push(
      bounds.minX - movingBounds.minX,
      bounds.maxX - movingBounds.maxX,
      bounds.minX - movingBounds.maxX,
      bounds.maxX - movingBounds.minX,
      centerX - movingCenterX,
    );
    yCandidates.push(
      bounds.minY - movingBounds.minY,
      bounds.maxY - movingBounds.maxY,
      bounds.minY - movingBounds.maxY,
      bounds.maxY - movingBounds.minY,
      centerY - movingCenterY,
    );
  }

  const deltaX = bestSnapDelta(xCandidates, thresholdCm);
  const deltaY = bestSnapDelta(yCandidates, thresholdCm);
  return {
    xCm: moving.xCm + (deltaX ?? 0),
    yCm: moving.yCm + (deltaY ?? 0),
    snappedX: deltaX !== undefined,
    snappedY: deltaY !== undefined,
  };
}

export function nearestWall(x: number, y: number, room: RoomGeometry): WallSide {
  const distances: Array<[WallSide, number]> = [
    ['north', y],
    ['south', room.lengthCm - y],
    ['west', x],
    ['east', room.widthCm - x],
  ];
  distances.sort((a, b) => a[1] - b[1]);
  return distances[0][0];
}

export function wallLocalPoint(point: Point, wall: WallSide, room: RoomGeometry): Point {
  switch (wall) {
    case 'north': return { x: point.x, y: point.y };
    case 'south': return { x: room.widthCm - point.x, y: room.lengthCm - point.y };
    case 'east': return { x: point.y, y: room.widthCm - point.x };
    case 'west': return { x: room.lengthCm - point.y, y: point.x };
  }
}

export function pointInDoorSwing(point: Point, door: PlannerObject, room: RoomGeometry) {
  if (door.catalogId !== 'door' || !door.wall) return false;
  const local = wallLocalPoint(point, door.wall, room);
  const doorCenter = wallLocalPoint({ x: door.xCm, y: door.yCm }, door.wall, room);
  const half = door.widthCm / 2;
  const hingeLeft = door.properties?.hinge !== 'right';
  const hingeX = doorCenter.x + (hingeLeft ? -half : half);
  const dx = local.x - hingeX;
  const dy = local.y - doorCenter.y;
  if (dy < 0 || Math.hypot(dx, dy) > door.widthCm) return false;
  const openingAngle = Math.max(0, Math.min(180, door.properties?.openingAngleDeg ?? 90));
  const angleFromClosed = hingeLeft
    ? normalizeAngle((Math.atan2(dy, dx) * 180) / Math.PI)
    : normalizeAngle((Math.atan2(dy, -dx) * 180) / Math.PI);
  return angleFromClosed <= openingAngle + 0.001;
}

export function objectHitsDoorSwing(object: PlannerObject, door: PlannerObject, room: RoomGeometry) {
  return [
    { x: object.xCm, y: object.yCm },
    ...objectCorners(object),
  ].some((p) => pointInDoorSwing(p, door, room));
}

export function angleDifference(a: number, b: number) {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return Math.min(diff, 360 - diff);
}

export function angleTo(from: Point, to: Point) {
  return normalizeAngle((Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI);
}
