import { describe, expect, it } from 'vitest';
import { createObjectFromCatalog } from '../data/catalog';
import { createDefaultProject } from '../lib/project';
import {
  applyRoomSurvey,
  measurementCenterOffset,
  validateRoomSurvey,
  type RoomSurveyDraft,
} from '../lib/roomSurvey';

const draft: RoomSurveyDraft = {
  roomName: 'B 2.14',
  widthCm: 800,
  lengthCm: 600,
  doors: [{ id: 'main', wall: 'A', startCm: 100, widthCm: 100, hinge: 'right', openingAngleDeg: 90, name: 'Haupteingang', primary: true }],
  wetAreas: [{ id: 'wet', wall: 'B', startCm: 120, widthCm: 160, depthCm: 60, kind: 'counter', name: 'Nasszeile' }],
  boards: [{ id: 'board', wall: 'C', startCm: 200, widthCm: 220, kind: 'digital-board', name: 'Digitale Tafel', mainBoard: true }],
};

describe('Raum-Vermessungsassistent', () => {
  it('übersetzt die Messrichtung an Wand A und D spiegelverkehrt', () => {
    const room = { widthCm: 800, lengthCm: 600 };
    expect(measurementCenterOffset('A', 100, 100, room)).toBe(650);
    expect(measurementCenterOffset('D', 50, 80, room)).toBe(510);
    expect(measurementCenterOffset('B', 50, 80, room)).toBe(90);
    expect(measurementCenterOffset('C', 100, 100, room)).toBe(150);
  });

  it('erzeugt Türwand A unten im Plan und speichert den Raumnamen', () => {
    const project = createDefaultProject();
    const variant = project.variants[0];
    variant.objects.push(createObjectFromCatalog('desk-double', 400, 300));

    const result = applyRoomSurvey(project, draft);
    const active = result.variants[0];
    const door = active.objects.find((object) => object.catalogId === 'door');
    const board = active.objects.find((object) => object.catalogId === 'digital-board');

    expect(result.meta.roomLabel).toBe('B 2.14');
    expect(active.room).toEqual({ widthCm: 800, lengthCm: 600 });
    expect(door?.wall).toBe('south');
    expect(door?.xCm).toBe(650);
    expect(door?.properties?.hinge).toBe('right');
    expect(board?.wall).toBe('north');
    expect(board?.properties?.mainBoard).toBe(true);
    expect(active.objects.some((object) => object.catalogId === 'desk-double')).toBe(true);
  });

  it('meldet Einbauten, die nicht vollständig auf eine Wand passen', () => {
    const invalid = structuredClone(draft);
    invalid.doors[0].startCm = 760;
    expect(validateRoomSurvey(invalid).some((message) => message.includes('Wand A'))).toBe(true);
  });
});
