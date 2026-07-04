import { describe, expect, it } from 'vitest';
import { createObjectFromCatalog, wallPlacement } from '../data/catalog';
import { objectHitsDoorSwing, objectInsideRoom, objectsIntersect, snap } from '../lib/geometry';

describe('Geometrie', () => {
  it('rastet Werte zuverlässig ein', () => {
    expect(snap(127, 5)).toBe(125);
    expect(snap(128, 10)).toBe(130);
  });

  it('erkennt sich überschneidende gedrehte Möbel', () => {
    const a = createObjectFromCatalog('desk-double', 200, 200);
    const b = createObjectFromCatalog('desk-double', 250, 210, { rotationDeg: 25 });
    expect(objectsIntersect(a, b)).toBe(true);
    b.xCm = 500;
    expect(objectsIntersect(a, b)).toBe(false);
  });

  it('prüft, ob ein Objekt vollständig im Raum liegt', () => {
    const desk = createObjectFromCatalog('desk-double', 100, 100);
    expect(objectInsideRoom(desk, { widthCm: 900, lengthCm: 700 })).toBe(true);
    desk.xCm = 10;
    expect(objectInsideRoom(desk, { widthCm: 900, lengthCm: 700 })).toBe(false);
  });

  it('erkennt Möbel im Türschwenkbereich', () => {
    const room = { widthCm: 900, lengthCm: 700 };
    const door = createObjectFromCatalog('door', 0, 0, {
      ...wallPlacement('north', room.widthCm, room.lengthCm, 100, 8, 150),
      properties: { hinge: 'left', openingAngleDeg: 90 },
    });
    const desk = createObjectFromCatalog('desk-single', 155, 55);
    expect(objectHitsDoorSwing(desk, door, room)).toBe(true);
    desk.xCm = 500;
    expect(objectHitsDoorSwing(desk, door, room)).toBe(false);
  });
});
