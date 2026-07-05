import { describe, expect, it } from 'vitest';
import { createObjectFromCatalog, wallPlacement } from '../data/catalog';
import { clampObjectToRoom, objectHitsDoorSwing, objectInsideRoom, objectsIntersect, resolveObjectShape, snap, snapObjectToObjects, trapezoidPoints } from '../lib/geometry';

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

  it('nutzt das Formfeld für Trapeztische und berechnet Trapezpunkte', () => {
    const trapezoid = createObjectFromCatalog('desk-trapezoid', 200, 200);
    expect(resolveObjectShape(trapezoid)).toBe('trapezoid');
    expect(trapezoid.shape).toBe('trapezoid');
    expect(trapezoidPoints(140, 70)).toEqual([-70, 35, 70, 35, 35, -35, -35, -35]);
  });

  it('klemmt gedrehte Möbel mit rotierter Bounding-Box in den Raum', () => {
    const room = { widthCm: 900, lengthCm: 700 };
    const desk = createObjectFromCatalog('desk-double', 40, 40, { rotationDeg: 45 });
    Object.assign(desk, clampObjectToRoom(desk, room));
    expect(objectInsideRoom(desk, room)).toBe(true);
  });

  it('rastet bewegte Möbel an Kanten anderer Objekte ein', () => {
    const fixed = createObjectFromCatalog('desk-double', 200, 200);
    const moving = createObjectFromCatalog('desk-double', 331, 200);
    const snapped = snapObjectToObjects(moving, [fixed], 8);
    expect(snapped.snappedX).toBe(true);
    expect(snapped.xCm).toBe(330);
  });
});
