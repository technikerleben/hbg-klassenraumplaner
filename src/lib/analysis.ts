import type { PlannerObject, PlannerWarning, RoomVariant, WallSide } from '../types/planner';
import { angleDifference, angleTo, objectCorners, objectHitsDoorSwing, objectInsideRoom, objectsIntersect, polygonsIntersect } from './geometry';
import { createId } from './id';

const warning = (severity: PlannerWarning['severity'], ruleId: string, title: string, message: string, objectIds: string[] = []): PlannerWarning => ({
  id: `${ruleId}-${objectIds.join('-') || createId()}`,
  severity,
  ruleId,
  title,
  message,
  objectIds,
});

function wallFrontAngle(wall?: WallSide) {
  switch (wall) {
    case 'north': return 270;
    case 'south': return 90;
    case 'east': return 180;
    case 'west': return 0;
    default: return 270;
  }
}

function seatFacing(object: PlannerObject) {
  if (object.catalogId === 'chair' || object.catalogId === 'stool') return object.rotationDeg - 90;
  return object.rotationDeg - 90;
}

function heaterZone(heater: PlannerObject, clearance: number): PlannerObject {
  return {
    ...heater,
    depthCm: heater.depthCm + clearance,
    yCm: heater.wall === 'north' ? heater.yCm + clearance / 2 : heater.wall === 'south' ? heater.yCm - clearance / 2 : heater.yCm,
    xCm: heater.wall === 'west' ? heater.xCm + clearance / 2 : heater.wall === 'east' ? heater.xCm - clearance / 2 : heater.xCm,
  };
}

function isObstacle(object: PlannerObject) {
  return object.collisionMode === 'solid' && object.kind !== 'wall' && object.kind !== 'symbol';
}

function gridPathExists(variant: RoomVariant, aisleWidth: number) {
  const room = variant.room;
  const doors = variant.objects.filter((o) => o.catalogId === 'door');
  if (!doors.length) return { reachable: 0, total: 0 };
  const learning = variant.objects.filter((o) => (o.places ?? 0) > 0 && o.catalogId !== 'chair' && o.catalogId !== 'stool');
  if (!learning.length) return { reachable: 0, total: 0 };
  const cell = 20;
  const cols = Math.max(1, Math.ceil(room.widthCm / cell));
  const rows = Math.max(1, Math.ceil(room.lengthCm / cell));
  const blocked = new Uint8Array(cols * rows);
  const inflate = Math.max(0, aisleWidth / 2 - cell / 2);
  const obstacles = variant.objects.filter(isObstacle);
  const idx = (x: number, y: number) => y * cols + x;
  for (let gy = 0; gy < rows; gy += 1) {
    for (let gx = 0; gx < cols; gx += 1) {
      const point = { x: gx * cell + cell / 2, y: gy * cell + cell / 2 };
      const probe: PlannerObject = { id: 'probe', catalogId: 'probe', kind: 'symbol', category: 'other', name: 'Probe', xCm: point.x, yCm: point.y, widthCm: cell, depthCm: cell, rotationDeg: 0, locked: true, collisionMode: 'ignore' };
      if (obstacles.some((o) => objectsIntersect(probe, o, 0, inflate))) blocked[idx(gx, gy)] = 1;
    }
  }
  const targets = doors.map((door) => {
    const tx = Math.max(0, Math.min(cols - 1, Math.floor(door.xCm / cell)));
    const ty = Math.max(0, Math.min(rows - 1, Math.floor(door.yCm / cell)));
    return [tx, ty] as const;
  });
  const canReach = (startX: number, startY: number) => {
    const sx = Math.max(0, Math.min(cols - 1, Math.floor(startX / cell)));
    const sy = Math.max(0, Math.min(rows - 1, Math.floor(startY / cell)));
    const queue: Array<[number, number]> = [[sx, sy]];
    const seen = new Uint8Array(cols * rows);
    seen[idx(sx, sy)] = 1;
    while (queue.length) {
      const [x, y] = queue.shift()!;
      if (targets.some(([tx, ty]) => Math.abs(tx - x) <= 1 && Math.abs(ty - y) <= 1)) return true;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const index = idx(nx, ny);
        if (seen[index] || blocked[index]) continue;
        seen[index] = 1;
        queue.push([nx, ny]);
      }
    }
    return false;
  };
  let reachable = 0;
  learning.forEach((item) => {
    const candidates = [
      { angle: item.rotationDeg + 90, distance: item.depthCm / 2 + aisleWidth / 2 + 10 },
      { angle: item.rotationDeg - 90, distance: item.depthCm / 2 + aisleWidth / 2 + 10 },
      { angle: item.rotationDeg, distance: item.widthCm / 2 + aisleWidth / 2 + 10 },
      { angle: item.rotationDeg + 180, distance: item.widthCm / 2 + aisleWidth / 2 + 10 },
    ];
    const accessible = candidates.some(({ angle, distance }) => {
      const rad = (angle * Math.PI) / 180;
      return canReach(item.xCm + Math.cos(rad) * distance, item.yCm + Math.sin(rad) * distance);
    });
    if (accessible) reachable += 1;
  });
  return { reachable, total: learning.length };
}

export function analyzeVariant(variant: RoomVariant, targetStudents: number, wheelchairMode: boolean): PlannerWarning[] {
  const warnings: PlannerWarning[] = [];
  const { objects, room, analysisSettings } = variant;
  const solid = objects.filter((o) => o.collisionMode === 'solid');
  const movable = objects.filter((o) => o.kind !== 'wall' && o.kind !== 'symbol');
  const doors = objects.filter((o) => o.catalogId === 'door');
  const heaters = objects.filter((o) => o.catalogId === 'heater');
  const mainBoard = objects.find((o) => (o.catalogId === 'digital-board' || o.catalogId === 'wall-board') && o.properties?.mainBoard)
    ?? objects.find((o) => o.catalogId === 'digital-board');

  if (!doors.length) warnings.push(warning('critical', 'door-missing', 'Keine Tür', 'Im Raum ist keine Tür angelegt.'));

  objects.forEach((object) => {
    if (!objectInsideRoom(object, room)) {
      warnings.push(warning('critical', 'outside-room', 'Objekt außerhalb des Raumes', `${object.name} liegt teilweise außerhalb des Grundrisses.`, [object.id]));
    }
  });

  for (let i = 0; i < solid.length; i += 1) {
    for (let j = i + 1; j < solid.length; j += 1) {
      const a = solid[i];
      const b = solid[j];
      if (a.kind === 'wall' && b.kind === 'wall') continue;
      if (objectsIntersect(a, b)) {
        warnings.push(warning('critical', 'collision', 'Möbel überschneiden sich', `${a.name} und ${b.name} überlagern sich.`, [a.id, b.id]));
      }
    }
  }

  doors.forEach((door) => {
    movable.forEach((object) => {
      if (objectHitsDoorSwing(object, door, room)) {
        warnings.push(warning('critical', 'door-swing', 'Türbereich blockiert', `${object.name} steht im Schwenkbereich der Tür.`, [door.id, object.id]));
      }
    });
  });

  heaters.forEach((heater) => {
    const zone = heaterZone(heater, heater.properties?.heaterClearanceCm ?? analysisSettings.heaterClearanceCm);
    movable.forEach((object) => {
      if (objectsIntersect(zone, object)) {
        warnings.push(warning('warning', 'heater-clearance', 'Heizkörper verstellt', `${object.name} steht in der eingestellten Freizone des Heizkörpers.`, [heater.id, object.id]));
      }
    });
  });

  variant.zones.filter((z) => z.mode === 'keep-clear').forEach((zone) => {
    const corners = [
      { x: zone.xCm - zone.widthCm / 2, y: zone.yCm - zone.depthCm / 2 },
      { x: zone.xCm + zone.widthCm / 2, y: zone.yCm - zone.depthCm / 2 },
      { x: zone.xCm + zone.widthCm / 2, y: zone.yCm + zone.depthCm / 2 },
      { x: zone.xCm - zone.widthCm / 2, y: zone.yCm + zone.depthCm / 2 },
    ];
    movable.forEach((object) => {
      if (polygonsIntersect(corners, objectCorners(object))) warnings.push(warning('warning', 'keep-clear-zone', 'Freizone belegt', `${object.name} steht in der Freizone „${zone.name}“.`, [object.id]));
    });
  });

  const places = objects.reduce((sum, o) => sum + (o.places ?? 0), 0);
  if (places < targetStudents) warnings.push(warning('info', 'places-missing', 'Lernplätze fehlen', `Es sind ${places} von ${targetStudents} benötigten Lernplätzen vorhanden.`));
  if (places > targetStudents + 4) warnings.push(warning('info', 'places-extra', 'Viele zusätzliche Plätze', `Der Plan enthält ${places} Lernplätze für ${targetStudents} Lernende.`));

  if (analysisSettings.checkSightlines && mainBoard) {
    const target = { x: mainBoard.xCm, y: mainBoard.yCm };
    objects.filter((o) => (o.places ?? 0) > 0 && o.kind === 'furniture').forEach((object) => {
      const desired = angleTo({ x: object.xCm, y: object.yCm }, target);
      const difference = angleDifference(seatFacing(object), desired);
      if (difference > 120) warnings.push(warning('info', 'board-facing-away', 'Blick von der Tafel weg', `${object.name} ist überwiegend von der Haupttafel weg ausgerichtet.`, [object.id]));
      else if (difference > 60) warnings.push(warning('info', 'board-angle', 'Ungünstiger Tafelwinkel', `${object.name} ist stark seitlich zur Haupttafel ausgerichtet.`, [object.id]));
    });
  }

  const path = gridPathExists(variant, analysisSettings.aisleWidthCm);
  if (path.total > 0 && path.reachable < path.total) {
    warnings.push(warning('warning', 'aisle-path', 'Nicht alle Plätze gut erreichbar', `Für ${path.total - path.reachable} Tischgruppen wurde kein durchgehender Weg mit etwa ${analysisSettings.aisleWidthCm} cm Breite zur Tür gefunden.`));
  }

  if (wheelchairMode || analysisSettings.checkWheelchair) {
    const wheelchair = objects.find((o) => o.catalogId === 'wheelchair-place');
    if (!wheelchair) warnings.push(warning('warning', 'wheelchair-missing', 'Rollstuhlplatz fehlt', 'Die Option Barrierefreiheit ist aktiv, aber es wurde keine Bewegungsfläche eingezeichnet.'));
    else if (!objectInsideRoom(wheelchair, room)) warnings.push(warning('critical', 'wheelchair-outside', 'Rollstuhlfläche außerhalb', 'Die Bewegungsfläche liegt nicht vollständig im Raum.', [wheelchair.id]));
  }

  return warnings;
}

export function variantStats(variant: RoomVariant, targetStudents: number, wheelchairMode: boolean) {
  const warnings = analyzeVariant(variant, targetStudents, wheelchairMode);
  return {
    places: variant.objects.reduce((sum, o) => sum + (o.places ?? 0), 0),
    critical: warnings.filter((w) => w.severity === 'critical').length,
    warning: warnings.filter((w) => w.severity === 'warning').length,
    info: warnings.filter((w) => w.severity === 'info').length,
    furnitureCount: variant.objects.filter((o) => o.kind === 'furniture').length,
    areaM2: (variant.room.widthCm * variant.room.lengthCm) / 10000,
  };
}
