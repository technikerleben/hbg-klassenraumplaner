import { describe, expect, it } from 'vitest';
import { generateTemplate, TEMPLATES } from '../lib/templates';

describe('Sitzordnungsvorlagen', () => {
  const room = { widthCm: 900, lengthCm: 700 };

  it('stellt alle veröffentlichten Vorlagen bereit', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(10);
  });

  it('erzeugt für Reihen mindestens die gewünschte Platzzahl', () => {
    const objects = generateTemplate('rows', 30, room, 'north');
    expect(objects.reduce((sum, object) => sum + (object.places ?? 0), 0)).toBeGreaterThanOrEqual(30);
  });

  it('erzeugt einen Sitzkreis ausschließlich aus Sitzmöbeln', () => {
    const objects = generateTemplate('circle', 24, room, 'north');
    expect(objects).toHaveLength(24);
    expect(objects.every((object) => object.catalogId === 'chair')).toBe(true);
  });

  it('richtet eine Vorlage an einer seitlichen Haupttafel aus', () => {
    const objects = generateTemplate('rows', 12, room, 'east');
    expect(objects.some((object) => Math.abs(object.rotationDeg) === 90)).toBe(true);
  });
});
