import type { PlannerObject, RoomGeometry, WallSide } from '../types/planner';

export interface Point { x: number; y: number }

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

export function objectCorners(object: PlannerObject, inflate = 0): Point[] {
  const halfW = object.widthCm / 2 + inflate;
  const halfH = object.depthCm / 2 + inflate;
  const c = { x: object.xCm, y: object.yCm };
  return [
    { x: c.x - halfW, y: c.y - halfH },
    { x: c.x + halfW, y: c.y - halfH },
    { x: c.x + halfW, y: c.y + halfH },
    { x: c.x - halfW, y: c.y + halfH },
  ].map((p) => rotatePoint(p, c, object.rotationDeg));
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
  const halfW = object.widthCm / 2;
  const halfH = object.depthCm / 2;
  return {
    xCm: Math.max(halfW, Math.min(room.widthCm - halfW, object.xCm)),
    yCm: Math.max(halfH, Math.min(room.lengthCm - halfH, object.yCm)),
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
  const inward = dy >= 0 && dy <= door.widthCm;
  const horizontal = hingeLeft ? dx >= 0 : dx <= 0;
  return inward && horizontal && Math.hypot(dx, dy) <= door.widthCm;
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
