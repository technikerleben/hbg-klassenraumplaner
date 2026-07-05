import { describe, expect, it } from 'vitest';
import { createObjectFromCatalog, wallPlacement } from '../data/catalog';
import { clampObjectToRoom, objectCorners, objectHitsDoorSwing, objectInsideRoom, snapObjectToObjects } from '../lib/geometry';

describe('Möbelformen und Bediengeometrie', () => {
  it('verwendet für Trapeztische eine Polygonform', () => {
    const table = createObjectFromCatalog('desk-trapezoid', 200, 200);
    const corners = objectCorners(table);
    expect(table.shape).toBe('trapezoid');
    expect(corners).toHaveLength(4);
    expect(corners[0].x).not.toBe(corners[2].x);
  });

  it('hält gedrehte Möbel im Raum', () => {
    const desk = createObjectFromCatalog('desk-double', 20, 20, { rotationDeg: 45 });
    Object.assign(desk, clampObjectToRoom(desk, { widthCm: 900, lengthCm: 700 }));
    expect(objectInsideRoom(desk, { widthCm: 900, lengthCm: 700 })).toBe(true);
  });

  it('berücksichtigt einen kleineren Türöffnungswinkel', () => {
    const room = { widthCm: 900, lengthCm: 700 };
    const door = createObjectFromCatalog('door', 0, 0, {
      ...wallPlacement('north', room.widthCm, room.lengthCm, 100, 8, 150),
      properties: { hinge: 'left', openingAngleDeg: 40 },
    });
    const nearLeaf = createObjectFromCatalog('waste-bin', 178, 22);
    const beyondArc = createObjectFromCatalog('waste-bin', 145, 90);
    expect(objectHitsDoorSwing(nearLeaf, door, room)).toBe(true);
    expect(objectHitsDoorSwing(beyondArc, door, room)).toBe(false);
  });

  it('rastet Möbel an benachbarten Kanten ein', () => {
    const fixed = createObjectFromCatalog('desk-double', 300, 300);
    const moving = createObjectFromCatalog('desk-double', 436, 300);
    const result = snapObjectToObjects(moving, [fixed], 8);
    expect(result.snappedX).toBe(true);
    expect(result.xCm).toBe(430);
  });
});
