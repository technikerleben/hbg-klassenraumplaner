import { createObjectFromCatalog, wallPlacement } from '../data/catalog';
import { clampObjectToRoom } from './geometry';
import type { PlannerObject, ProjectFile, RoomGeometry, RoomVariant, WallSide } from '../types/planner';

export type SurveyWall = 'A' | 'B' | 'C' | 'D';

export interface SurveyDoor {
  id: string;
  wall: SurveyWall;
  startCm: number;
  widthCm: number;
  hinge: 'left' | 'right';
  openingAngleDeg: number;
  name: string;
  primary: boolean;
}

export interface SurveyWetArea {
  id: string;
  wall: SurveyWall;
  startCm: number;
  widthCm: number;
  depthCm: number;
  kind: 'washbasin' | 'counter';
  name: string;
}

export interface SurveyBoard {
  id: string;
  wall: SurveyWall;
  startCm: number;
  widthCm: number;
  kind: 'digital-board' | 'wall-board' | 'pinboard';
  name: string;
  mainBoard: boolean;
}

export interface RoomSurveyDraft {
  roomName: string;
  widthCm: number;
  lengthCm: number;
  doors: SurveyDoor[];
  wetAreas: SurveyWetArea[];
  boards: SurveyBoard[];
}

export const SURVEY_WALL_TO_SIDE: Record<SurveyWall, WallSide> = {
  A: 'south',
  B: 'east',
  C: 'north',
  D: 'west',
};

export const SIDE_TO_SURVEY_WALL: Record<WallSide, SurveyWall> = {
  south: 'A',
  east: 'B',
  north: 'C',
  west: 'D',
};

const MANAGED_CATALOG_IDS = new Set([
  'door',
  'washbasin',
  'wet-counter-120',
  'wet-counter-180',
  'digital-board',
  'wall-board',
  'pinboard',
]);

function surveyId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function wallLengthCm(wall: SurveyWall, room: RoomGeometry) {
  return wall === 'A' || wall === 'C' ? room.widthCm : room.lengthCm;
}

export function measurementCenterOffset(wall: SurveyWall, startCm: number, widthCm: number, room: RoomGeometry) {
  const length = wallLengthCm(wall, room);
  const centerFromMeasuredLeft = startCm + widthCm / 2;
  return wall === 'A' || wall === 'D' ? length - centerFromMeasuredLeft : centerFromMeasuredLeft;
}

export function measurementStartFromObject(object: PlannerObject, room: RoomGeometry) {
  if (!object.wall) return 0;
  const wall = SIDE_TO_SURVEY_WALL[object.wall];
  const along = object.wall === 'north' || object.wall === 'south' ? object.xCm : object.yCm;
  const length = wallLengthCm(wall, room);
  return wall === 'A' || wall === 'D'
    ? Math.max(0, Math.round(length - along - object.widthCm / 2))
    : Math.max(0, Math.round(along - object.widthCm / 2));
}

export function createRoomSurveyDraft(project: ProjectFile, variant: RoomVariant): RoomSurveyDraft {
  const room = variant.room;
  const existingSouthDoor = variant.objects.find((object) => object.catalogId === 'door' && object.wall === 'south');
  const doors: SurveyDoor[] = [];

  if (existingSouthDoor) {
    doors.push({
      id: existingSouthDoor.id,
      wall: 'A',
      startCm: measurementStartFromObject(existingSouthDoor, room),
      widthCm: existingSouthDoor.widthCm,
      hinge: existingSouthDoor.properties?.hinge ?? 'left',
      openingAngleDeg: existingSouthDoor.properties?.openingAngleDeg ?? 90,
      name: existingSouthDoor.name || 'Haupteingang',
      primary: true,
    });
  } else {
    doors.push({ id: surveyId('door'), wall: 'A', startCm: 80, widthCm: 100, hinge: 'left', openingAngleDeg: 90, name: 'Haupteingang', primary: true });
  }

  variant.objects
    .filter((object) => object.catalogId === 'door' && object.id !== existingSouthDoor?.id && object.wall)
    .forEach((object) => doors.push({
      id: object.id,
      wall: SIDE_TO_SURVEY_WALL[object.wall!],
      startCm: measurementStartFromObject(object, room),
      widthCm: object.widthCm,
      hinge: object.properties?.hinge ?? 'left',
      openingAngleDeg: object.properties?.openingAngleDeg ?? 90,
      name: object.name || 'Weitere Tür',
      primary: false,
    }));

  const wetAreas: SurveyWetArea[] = variant.objects
    .filter((object) => ['washbasin', 'wet-counter-120', 'wet-counter-180'].includes(object.catalogId) && object.wall)
    .map((object) => ({
      id: object.id,
      wall: SIDE_TO_SURVEY_WALL[object.wall!],
      startCm: measurementStartFromObject(object, room),
      widthCm: object.widthCm,
      depthCm: object.depthCm,
      kind: object.catalogId === 'washbasin' ? 'washbasin' : 'counter',
      name: object.name,
    }));

  const boards: SurveyBoard[] = variant.objects
    .filter((object) => ['digital-board', 'wall-board', 'pinboard'].includes(object.catalogId) && object.wall)
    .map((object) => ({
      id: object.id,
      wall: SIDE_TO_SURVEY_WALL[object.wall!],
      startCm: measurementStartFromObject(object, room),
      widthCm: object.widthCm,
      kind: object.catalogId as SurveyBoard['kind'],
      name: object.name,
      mainBoard: Boolean(object.properties?.mainBoard),
    }));

  return {
    roomName: project.meta.roomLabel ?? '',
    widthCm: room.widthCm,
    lengthCm: room.lengthCm,
    doors,
    wetAreas,
    boards,
  };
}

export function validateRoomSurvey(draft: RoomSurveyDraft) {
  const errors: string[] = [];
  if (draft.widthCm < 300 || draft.widthCm > 3000) errors.push('Die Raumbreite muss zwischen 300 und 3000 cm liegen.');
  if (draft.lengthCm < 300 || draft.lengthCm > 3000) errors.push('Die Raumlänge muss zwischen 300 und 3000 cm liegen.');
  if (!draft.doors.length || draft.doors[0].wall !== 'A') errors.push('Die Haupttür muss in Wand A liegen.');

  const room = { widthCm: draft.widthCm, lengthCm: draft.lengthCm };
  const entries = [
    ...draft.doors.map((item) => ({ wall: item.wall, startCm: item.startCm, widthCm: item.widthCm, label: item.name || 'Tür' })),
    ...draft.wetAreas.map((item) => ({ wall: item.wall, startCm: item.startCm, widthCm: item.widthCm, label: item.name || 'Nassbereich' })),
    ...draft.boards.map((item) => ({ wall: item.wall, startCm: item.startCm, widthCm: item.widthCm, label: item.name || 'Tafel' })),
  ];
  entries.forEach((entry) => {
    const length = wallLengthCm(entry.wall, room);
    if (entry.startCm < 0 || entry.widthCm <= 0 || entry.startCm + entry.widthCm > length) {
      errors.push(`${entry.label} passt nicht vollständig auf Wand ${entry.wall} (${length} cm).`);
    }
  });
  draft.wetAreas.forEach((item) => {
    if (item.depthCm < 10 || item.depthCm > 250) errors.push(`${item.name || 'Nassbereich'} benötigt eine Tiefe zwischen 10 und 250 cm.`);
  });
  return errors;
}

function placedObject(
  catalogId: string,
  wall: SurveyWall,
  startCm: number,
  widthCm: number,
  depthCm: number,
  room: RoomGeometry,
  overrides: Partial<PlannerObject>,
) {
  const side = SURVEY_WALL_TO_SIDE[wall];
  const offset = measurementCenterOffset(wall, startCm, widthCm, room);
  return createObjectFromCatalog(catalogId, 0, 0, {
    ...wallPlacement(side, room.widthCm, room.lengthCm, widthCm, depthCm, offset),
    widthCm,
    depthCm,
    locked: true,
    ...overrides,
  });
}

export function applyRoomSurvey(project: ProjectFile, draft: RoomSurveyDraft): ProjectFile {
  const next = structuredClone(project);
  next.meta.roomLabel = draft.roomName.trim();
  const variant = next.variants.find((item) => item.id === next.activeVariantId) ?? next.variants[0];
  const room = {
    widthCm: Math.max(300, Math.min(3000, Math.round(draft.widthCm))),
    lengthCm: Math.max(300, Math.min(3000, Math.round(draft.lengthCm))),
  };
  variant.room = room;

  const retained = variant.objects
    .filter((object) => !MANAGED_CATALOG_IDS.has(object.catalogId))
    .map((object) => {
      if (object.wall) {
        const along = object.wall === 'north' || object.wall === 'south' ? object.xCm : object.yCm;
        return { ...object, ...wallPlacement(object.wall, room.widthCm, room.lengthCm, object.widthCm, object.depthCm, along) };
      }
      return { ...object, ...clampObjectToRoom(object, room) };
    });

  const doors = draft.doors.map((door, index) => placedObject('door', index === 0 ? 'A' : door.wall, door.startCm, door.widthCm, 8, room, {
    name: door.name.trim() || (index === 0 ? 'Haupteingang' : 'Tür'),
    properties: { hinge: door.hinge, openingAngleDeg: door.openingAngleDeg },
  }));

  const wetAreas = draft.wetAreas.map((area) => placedObject(area.kind === 'washbasin' ? 'washbasin' : 'wet-counter-180', area.wall, area.startCm, area.widthCm, area.depthCm, room, {
    name: area.name.trim() || (area.kind === 'washbasin' ? 'Waschbecken' : 'Nassbereich'),
  }));

  const selectedMainBoardId = draft.boards.find((board) => board.mainBoard)?.id;
  const boards = draft.boards.map((board) => placedObject(board.kind, board.wall, board.startCm, board.widthCm, board.kind === 'pinboard' ? 8 : 10, room, {
    name: board.name.trim() || (board.kind === 'digital-board' ? 'Digitale Tafel' : board.kind === 'pinboard' ? 'Pinnwand' : 'Wandtafel'),
    properties: { mainBoard: board.id === selectedMainBoardId },
  }));

  variant.objects = [...retained, ...doors, ...wetAreas, ...boards];
  next.updatedAt = new Date().toISOString();
  return next;
}
