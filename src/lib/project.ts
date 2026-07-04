import { createObjectFromCatalog, getCatalogItem, wallPlacement } from '../data/catalog';
import type { ProjectFile, RoomVariant } from '../types/planner';
import { createId } from './id';

export const SCHEMA_VERSION = 1;

export function createDefaultVariant(name = 'Variante 1'): RoomVariant {
  const room = { widthCm: 900, lengthCm: 700 };
  const board = createObjectFromCatalog('digital-board', 450, 5, {
    ...wallPlacement('north', room.widthCm, room.lengthCm, 200, 10),
    locked: true,
    properties: { mainBoard: true },
  });
  const door = createObjectFromCatalog('door', 4, 600, {
    ...wallPlacement('west', room.widthCm, room.lengthCm, 100, 8, 600),
    locked: true,
    properties: { hinge: 'right', openingAngleDeg: 90 },
  });
  const windowObject = createObjectFromCatalog('window', 899, 250, {
    ...wallPlacement('east', room.widthCm, room.lengthCm, 180, 8, 250),
    locked: true,
    widthCm: 180,
    properties: { hasHeater: false },
  });
  return {
    id: createId(),
    name,
    note: '',
    room,
    objects: [board, door, windowObject],
    zones: [],
    analysisSettings: {
      aisleWidthCm: 100,
      heaterClearanceCm: 20,
      checkSightlines: true,
      checkWheelchair: false,
    },
  };
}

export function createDefaultProject(): ProjectFile {
  const variant = createDefaultVariant();
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    meta: {
      title: 'Mein Klassenraum',
      roomLabel: '',
      school: '',
      note: '',
      targetStudentCount: 30,
      wheelchairMode: false,
    },
    activeVariantId: variant.id,
    variants: [variant],
    createdAt: now,
    updatedAt: now,
  };
}

export function sanitizeProject(input: unknown): ProjectFile {
  if (!input || typeof input !== 'object') throw new Error('Die Datei enthält kein gültiges Projekt.');
  const p = input as Partial<ProjectFile>;
  if (!Array.isArray(p.variants) || !p.variants.length) throw new Error('Das Projekt enthält keine Raumvariante.');
  if (!p.meta || typeof p.meta.title !== 'string') throw new Error('Im Projekt fehlen die Metadaten.');
  if (typeof p.schemaVersion !== 'number' || p.schemaVersion > SCHEMA_VERSION) {
    throw new Error('Diese Projektdatei wurde mit einer neueren App-Version erstellt.');
  }
  const project = structuredClone(p as ProjectFile);
  project.variants.forEach((variant) => {
    variant.objects.forEach((object) => {
      const catalogItem = getCatalogItem(object.catalogId);
      if (catalogItem) object.color = catalogItem.color;
    });
  });
  return project;
}
