import type { CatalogItem, Category, PlannerObject, WallSide } from '../types/planner';
import { createId } from '../lib/id';

export const CATEGORY_LABELS: Record<Category, string> = {
  tables: 'Tische',
  seating: 'Sitzmöbel',
  storage: 'Aufbewahrung',
  presentation: 'Präsentation',
  flexible: 'Flexible Lernmöbel',
  fixed: 'Feste Einbauten',
  wet: 'Nassbereich',
  other: 'Sonstiges',
};

export const CATALOG: CatalogItem[] = [
  { id: 'desk-double', name: 'Doppeltisch', category: 'tables', kind: 'furniture', widthCm: 130, depthCm: 50, places: 2, color: '#791D22', description: 'Standard: 130 × 50 cm, zwei Lernplätze' },
  { id: 'desk-double-deep', name: 'Doppeltisch tief', category: 'tables', kind: 'furniture', widthCm: 130, depthCm: 55, places: 2, color: '#791D22', description: '130 × 55 cm, zwei Lernplätze' },
  { id: 'desk-single', name: 'Einzeltisch', category: 'tables', kind: 'furniture', widthCm: 70, depthCm: 50, places: 1, color: '#E8C9CB', description: '70 × 50 cm, ein Lernplatz' },
  { id: 'desk-single-deep', name: 'Einzeltisch tief', category: 'tables', kind: 'furniture', widthCm: 70, depthCm: 55, places: 1, color: '#E8C9CB', description: '70 × 55 cm, ein Lernplatz' },
  { id: 'desk-trapezoid', name: 'Trapeztisch', category: 'tables', kind: 'furniture', widthCm: 140, depthCm: 70, places: 2, color: '#791D22', shape: 'trapezoid', description: 'Variabel kombinierbarer Trapeztisch' },
  { id: 'desk-group-square', name: 'Gruppentisch quadratisch', category: 'tables', kind: 'furniture', widthCm: 140, depthCm: 140, places: 4, color: '#E8C9CB', description: '140 × 140 cm, vier Lernplätze' },
  { id: 'desk-group-round', name: 'Gruppentisch rund', category: 'tables', kind: 'furniture', widthCm: 120, depthCm: 120, places: 4, color: '#E8C9CB', shape: 'round', description: 'Ø 120 cm, vier Lernplätze' },
  { id: 'teacher-desk', name: 'Lehrertisch', category: 'tables', kind: 'furniture', widthCm: 140, depthCm: 70, color: '#245688', description: '140 × 70 cm' },
  { id: 'lectern', name: 'Lehrerpult', category: 'tables', kind: 'furniture', widthCm: 80, depthCm: 60, color: '#6C93B8', description: 'Kompaktes Pult' },
  { id: 'standing-table', name: 'Stehtisch', category: 'tables', kind: 'furniture', widthCm: 120, depthCm: 60, places: 2, color: '#3F6B4D', description: '120 × 60 cm' },

  { id: 'chair', name: 'Schülerstuhl', category: 'seating', kind: 'furniture', widthCm: 45, depthCm: 50, places: 1, color: '#3F6B4D', description: 'Einzelner Lernplatz' },
  { id: 'stool', name: 'Hocker', category: 'seating', kind: 'furniture', widthCm: 35, depthCm: 35, places: 1, color: '#7C9C82', shape: 'round', description: 'Ø 35 cm' },
  { id: 'bench', name: 'Sitzbank', category: 'seating', kind: 'furniture', widthCm: 120, depthCm: 40, places: 2, color: '#7C9C82', shape: 'bench', description: '120 × 40 cm' },
  { id: 'beanbag', name: 'Sitzsack', category: 'seating', kind: 'furniture', widthCm: 80, depthCm: 80, places: 1, color: '#D6E3D2', shape: 'ellipse', description: 'Flexible Sitzgelegenheit' },
  { id: 'floor-cushion', name: 'Bodenkissen', category: 'seating', kind: 'furniture', widthCm: 50, depthCm: 50, places: 1, color: '#D6E3D2', description: '50 × 50 cm' },

  { id: 'shelf-low', name: 'Regal niedrig', category: 'storage', kind: 'furniture', widthCm: 100, depthCm: 40, color: '#6C93B8', description: '100 × 40 cm', tall: false },
  { id: 'shelf-high', name: 'Regal hoch', category: 'storage', kind: 'furniture', widthCm: 100, depthCm: 45, color: '#245688', description: '100 × 45 cm', tall: true },
  { id: 'cabinet-low', name: 'Schrank niedrig', category: 'storage', kind: 'furniture', widthCm: 100, depthCm: 45, color: '#6C93B8', description: '100 × 45 cm', tall: false },
  { id: 'cabinet-high', name: 'Schrank hoch', category: 'storage', kind: 'furniture', widthCm: 100, depthCm: 50, color: '#163A5C', description: '100 × 50 cm', tall: true },
  { id: 'material-cart', name: 'Materialwagen', category: 'storage', kind: 'furniture', widthCm: 80, depthCm: 50, color: '#6C93B8', description: '80 × 50 cm' },
  { id: 'charging-station', name: 'Ladestation', category: 'storage', kind: 'furniture', widthCm: 80, depthCm: 50, color: '#245688', description: 'Für Tablets und Notebooks' },
  { id: 'wardrobe', name: 'Garderobe', category: 'storage', kind: 'furniture', widthCm: 100, depthCm: 40, color: '#6C93B8', description: '100 × 40 cm' },

  { id: 'digital-board', name: 'Digitale Tafel', category: 'presentation', kind: 'wall', widthCm: 200, depthCm: 10, color: '#163A5C', wallBound: true, description: 'Als Haupttafel markierbar' },
  { id: 'wall-board', name: 'Wandtafel', category: 'presentation', kind: 'wall', widthCm: 200, depthCm: 8, color: '#245688', wallBound: true, description: 'Tafel oder Whiteboard' },
  { id: 'mobile-board', name: 'Mobile Tafel', category: 'presentation', kind: 'furniture', widthCm: 120, depthCm: 60, color: '#245688', description: '120 × 60 cm Stellfläche', tall: true },
  { id: 'pinboard', name: 'Pinnwand', category: 'presentation', kind: 'wall', widthCm: 120, depthCm: 8, color: '#791D22', wallBound: true, collisionMode: 'ignore', description: 'Wandgebundene Präsentationsfläche' },

  { id: 'room-divider', name: 'Raumteiler', category: 'flexible', kind: 'furniture', widthCm: 120, depthCm: 40, color: '#3F6B4D', description: '120 × 40 cm', tall: true },
  { id: 'learning-island', name: 'Lerninsel', category: 'flexible', kind: 'furniture', widthCm: 160, depthCm: 80, places: 4, color: '#3F6B4D', description: 'Flexible Gruppenfläche' },
  { id: 'acoustic-sofa', name: 'Akustiksofa', category: 'flexible', kind: 'furniture', widthCm: 140, depthCm: 75, places: 2, color: '#7C9C82', shape: 'sofa', description: 'Zweisitziges Rückzugsmöbel', tall: true },
  { id: 'carpet-small', name: 'Teppich 2 × 2 m', category: 'flexible', kind: 'zone', widthCm: 200, depthCm: 200, color: '#CBDBE9', collisionMode: 'ignore', description: 'Markiert eine Präsentations- oder Sitzfläche' },
  { id: 'carpet-large', name: 'Teppich 3 × 2 m', category: 'flexible', kind: 'zone', widthCm: 300, depthCm: 200, color: '#CBDBE9', collisionMode: 'ignore', description: 'Große flexible Lernfläche' },

  { id: 'door', name: 'Tür', category: 'fixed', kind: 'wall', widthCm: 100, depthCm: 8, color: '#791D22', wallBound: true, description: 'Öffnet immer nach innen' },
  { id: 'window', name: 'Fenster', category: 'fixed', kind: 'wall', widthCm: 140, depthCm: 8, color: '#6C93B8', wallBound: true, collisionMode: 'ignore', description: 'Optional mit Heizkörper' },
  { id: 'heater', name: 'Heizkörper', category: 'fixed', kind: 'wall', widthCm: 120, depthCm: 20, color: '#B8791E', wallBound: true, description: 'Mit konfigurierbarer Freizone' },

  { id: 'washbasin', name: 'Waschbecken', category: 'wet', kind: 'wall', widthCm: 60, depthCm: 55, color: '#6C93B8', wallBound: true, description: '60 × 55 cm' },
  { id: 'wet-counter-120', name: 'Nasszeile 120 cm', category: 'wet', kind: 'wall', widthCm: 120, depthCm: 60, color: '#6C93B8', wallBound: true, description: 'Arbeitszeile mit Waschbecken' },
  { id: 'wet-counter-180', name: 'Nasszeile 180 cm', category: 'wet', kind: 'wall', widthCm: 180, depthCm: 60, color: '#6C93B8', wallBound: true, description: 'Lange Arbeitszeile' },
  { id: 'wet-zone', name: 'Freie Nasszone', category: 'wet', kind: 'zone', widthCm: 200, depthCm: 120, color: '#CBDBE9', collisionMode: 'warning', description: 'Markiert einen Spritzwasser- oder Experimentierbereich' },

  { id: 'wheelchair-place', name: 'Rollstuhlplatz', category: 'other', kind: 'zone', widthCm: 150, depthCm: 150, color: '#3F6B4D', collisionMode: 'warning', description: 'Optionale Bewegungsfläche 150 × 150 cm' },
  { id: 'plant', name: 'Pflanze', category: 'other', kind: 'furniture', widthCm: 45, depthCm: 45, color: '#2F4A38', shape: 'round', description: 'Dekoratives Hindernis' },
  { id: 'waste-bin', name: 'Papierkorb', category: 'other', kind: 'furniture', widthCm: 35, depthCm: 35, color: '#6C93B8', shape: 'round', description: '35 × 35 cm' },
  { id: 'note', name: 'Notizfeld', category: 'other', kind: 'symbol', widthCm: 100, depthCm: 50, color: '#F8EEEE', collisionMode: 'ignore', description: 'Freie Beschriftung im Plan' }
];

export const getCatalogItem = (id: string) => CATALOG.find((item) => item.id === id);

export function createObjectFromCatalog(
  catalogId: string,
  xCm: number,
  yCm: number,
  overrides: Partial<PlannerObject> = {},
): PlannerObject {
  const item = getCatalogItem(catalogId);
  if (!item) throw new Error(`Unbekanntes Katalogobjekt: ${catalogId}`);
  const wall = item.wallBound ? (overrides.wall ?? 'north') : undefined;
  return {
    id: createId(),
    catalogId: item.id,
    kind: item.kind,
    category: item.category,
    name: item.name,
    shape: item.shape,
    xCm,
    yCm,
    widthCm: item.widthCm,
    depthCm: item.depthCm,
    rotationDeg: 0,
    locked: false,
    collisionMode: item.collisionMode ?? 'solid',
    wall,
    places: item.places,
    color: item.color,
    properties: {
      hinge: item.id === 'door' ? 'left' : undefined,
      openingAngleDeg: item.id === 'door' ? 90 : undefined,
      mainBoard: item.id === 'digital-board' ? false : undefined,
      hasHeater: item.id === 'window' ? false : undefined,
      heaterClearanceCm: item.id === 'heater' ? 20 : undefined,
      wheelchairPlace: item.id === 'wheelchair-place' ? true : undefined,
      tall: item.tall,
      label: item.id === 'note' ? 'Notiz' : undefined,
    },
    ...overrides,
  };
}

export function wallPlacement(
  wall: WallSide,
  roomWidth: number,
  roomLength: number,
  objectWidth: number,
  depth: number,
  offsetCm?: number,
): Pick<PlannerObject, 'xCm' | 'yCm' | 'rotationDeg' | 'wall'> {
  const offset = offsetCm ?? (wall === 'north' || wall === 'south' ? roomWidth / 2 : roomLength / 2);
  switch (wall) {
    case 'north': return { xCm: Math.min(Math.max(objectWidth / 2, offset), roomWidth - objectWidth / 2), yCm: depth / 2, rotationDeg: 0, wall };
    case 'south': return { xCm: Math.min(Math.max(objectWidth / 2, offset), roomWidth - objectWidth / 2), yCm: roomLength - depth / 2, rotationDeg: 180, wall };
    case 'east': return { xCm: roomWidth - depth / 2, yCm: Math.min(Math.max(objectWidth / 2, offset), roomLength - objectWidth / 2), rotationDeg: 90, wall };
    case 'west': return { xCm: depth / 2, yCm: Math.min(Math.max(objectWidth / 2, offset), roomLength - objectWidth / 2), rotationDeg: -90, wall };
  }
}
