import { create } from 'zustand';
import { createObjectFromCatalog, getCatalogItem, wallPlacement } from '../data/catalog';
import { clampObjectToRoom, nearestWall, snap } from '../lib/geometry';
import { createDefaultProject, createDefaultVariant, sanitizeProject } from '../lib/project';
import { generateTemplate } from '../lib/templates';
import type { PlannerObject, PlannerZone, ProjectFile, RoomVariant, WallSide } from '../types/planner';
import { createId } from '../lib/id';

export type AppMode = 'room' | 'furniture' | 'templates' | 'analysis' | 'compare';

interface Snapshot {
  project: ProjectFile;
}

interface PlannerState {
  project: ProjectFile;
  selectedIds: string[];
  mode: AppMode;
  showGrid: boolean;
  showAnalysis: boolean;
  snapStepCm: number;
  zoom: number;
  history: Snapshot[];
  future: Snapshot[];
  lastSavedAt?: string;
  activeVariant: () => RoomVariant;
  setMode: (mode: AppMode) => void;
  setSelected: (ids: string[]) => void;
  toggleSelected: (id: string) => void;
  setShowGrid: (show: boolean) => void;
  setShowAnalysis: (show: boolean) => void;
  setSnapStep: (step: number) => void;
  setZoom: (zoom: number) => void;
  updateMeta: (patch: Partial<ProjectFile['meta']>) => void;
  updateRoom: (widthCm: number, lengthCm: number) => void;
  addCatalogObject: (catalogId: string, wall?: WallSide) => void;
  addObjectAt: (catalogId: string, xCm: number, yCm: number) => void;
  updateObject: (id: string, patch: Partial<PlannerObject>, commit?: boolean) => void;
  moveObject: (id: string, xCm: number, yCm: number, commit?: boolean) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  rotateSelected: (degrees?: number) => void;
  toggleLockSelected: () => void;
  setMainBoard: (id: string) => void;
  setWindowHeater: (id: string, enabled: boolean) => void;
  applyTemplate: (templateId: string, replaceStudentFurniture: boolean) => void;
  addVariant: () => void;
  duplicateVariant: () => void;
  renameVariant: (id: string, name: string) => void;
  deleteVariant: (id: string) => void;
  setActiveVariant: (id: string) => void;
  updateAnalysisSettings: (patch: Partial<RoomVariant['analysisSettings']>) => void;
  undo: () => void;
  redo: () => void;
  newProject: () => void;
  importProject: (input: unknown) => void;
  markSaved: () => void;
}

const deepClone = <T,>(value: T): T => structuredClone(value);

function active(project: ProjectFile) {
  return project.variants.find((v) => v.id === project.activeVariantId) ?? project.variants[0];
}

function withVariant(project: ProjectFile, updater: (variant: RoomVariant) => void) {
  const next = deepClone(project);
  const variant = active(next);
  updater(variant);
  next.updatedAt = new Date().toISOString();
  return next;
}

function studentFurniture(object: PlannerObject) {
  return ['desk-double', 'desk-double-deep', 'desk-single', 'desk-single-deep', 'desk-trapezoid', 'desk-group-square', 'desk-group-round', 'chair', 'stool'].includes(object.catalogId);
}

export const usePlannerStore = create<PlannerState>((set, get) => {
  const commitProject = (next: ProjectFile) => set((state) => ({
    project: next,
    history: [...state.history.slice(-99), { project: deepClone(state.project) }],
    future: [],
  }));

  return {
    project: createDefaultProject(),
    selectedIds: [],
    mode: 'furniture',
    showGrid: true,
    showAnalysis: true,
    snapStepCm: 5,
    zoom: 1,
    history: [],
    future: [],
    activeVariant: () => active(get().project),
    setMode: (mode) => set({ mode }),
    setSelected: (selectedIds) => set({ selectedIds }),
    toggleSelected: (id) => set((state) => ({ selectedIds: state.selectedIds.includes(id) ? state.selectedIds.filter((x) => x !== id) : [...state.selectedIds, id] })),
    setShowGrid: (showGrid) => set({ showGrid }),
    setShowAnalysis: (showAnalysis) => set({ showAnalysis }),
    setSnapStep: (snapStepCm) => set({ snapStepCm }),
    setZoom: (zoom) => set({ zoom: Math.min(2, Math.max(0.4, zoom)) }),
    updateMeta: (patch) => commitProject({ ...deepClone(get().project), meta: { ...get().project.meta, ...patch }, updatedAt: new Date().toISOString() }),
    updateRoom: (widthCm, lengthCm) => {
      const next = withVariant(get().project, (variant) => {
        variant.room.widthCm = Math.max(300, Math.min(3000, Math.round(widthCm)));
        variant.room.lengthCm = Math.max(300, Math.min(3000, Math.round(lengthCm)));
        variant.objects = variant.objects.map((o) => ({ ...o, ...clampObjectToRoom(o, variant.room) }));
      });
      commitProject(next);
    },
    addCatalogObject: (catalogId, requestedWall) => {
      const item = getCatalogItem(catalogId);
      if (!item) return;
      const variant = active(get().project);
      let object: PlannerObject;
      if (item.wallBound) {
        const wall = requestedWall ?? 'north';
        object = createObjectFromCatalog(catalogId, 0, 0, { ...wallPlacement(wall, variant.room.widthCm, variant.room.lengthCm, item.widthCm, item.depthCm), locked: true });
      } else {
        object = createObjectFromCatalog(catalogId, variant.room.widthCm / 2, variant.room.lengthCm / 2);
      }
      const next = withVariant(get().project, (v) => { v.objects.push(object); });
      commitProject(next);
      set({ selectedIds: [object.id] });
    },
    addObjectAt: (catalogId, xCm, yCm) => {
      const item = getCatalogItem(catalogId);
      if (!item) return;
      const variant = active(get().project);
      const wall = item.wallBound ? nearestWall(xCm, yCm, variant.room) : undefined;
      const object = item.wallBound
        ? createObjectFromCatalog(catalogId, xCm, yCm, { ...wallPlacement(wall!, variant.room.widthCm, variant.room.lengthCm, item.widthCm, item.depthCm, wall === 'north' || wall === 'south' ? xCm : yCm), locked: true })
        : createObjectFromCatalog(catalogId, xCm, yCm);
      const next = withVariant(get().project, (v) => { v.objects.push(object); });
      commitProject(next);
      set({ selectedIds: [object.id] });
    },
    updateObject: (id, patch, commit = true) => {
      const next = withVariant(get().project, (variant) => {
        const index = variant.objects.findIndex((o) => o.id === id);
        if (index < 0) return;
        variant.objects[index] = { ...variant.objects[index], ...patch, properties: patch.properties ? { ...variant.objects[index].properties, ...patch.properties } : variant.objects[index].properties };
      });
      if (commit) commitProject(next); else set({ project: next });
    },
    moveObject: (id, xCm, yCm, commit = true) => {
      const state = get();
      const step = state.snapStepCm;
      const next = withVariant(state.project, (variant) => {
        const object = variant.objects.find((o) => o.id === id);
        if (!object || object.locked) return;
        object.xCm = snap(xCm, step);
        object.yCm = snap(yCm, step);
        Object.assign(object, clampObjectToRoom(object, variant.room));
      });
      if (commit) commitProject(next); else set({ project: next });
    },
    deleteSelected: () => {
      const ids = new Set(get().selectedIds);
      if (!ids.size) return;
      const next = withVariant(get().project, (variant) => { variant.objects = variant.objects.filter((o) => !ids.has(o.id)); });
      commitProject(next);
      set({ selectedIds: [] });
    },
    duplicateSelected: () => {
      const ids = new Set(get().selectedIds);
      const newIds: string[] = [];
      const next = withVariant(get().project, (variant) => {
        const clones = variant.objects.filter((o) => ids.has(o.id)).map((o) => {
          const clone = { ...deepClone(o), id: createId(), xCm: o.xCm + 30, yCm: o.yCm + 30, locked: false };
          newIds.push(clone.id);
          return clone;
        });
        variant.objects.push(...clones);
      });
      commitProject(next);
      set({ selectedIds: newIds });
    },
    rotateSelected: (degrees = 90) => {
      const ids = new Set(get().selectedIds);
      const next = withVariant(get().project, (variant) => {
        variant.objects.forEach((o) => { if (ids.has(o.id) && !o.locked && o.kind !== 'wall') o.rotationDeg = (o.rotationDeg + degrees) % 360; });
      });
      commitProject(next);
    },
    toggleLockSelected: () => {
      const ids = new Set(get().selectedIds);
      const next = withVariant(get().project, (variant) => {
        variant.objects.forEach((o) => { if (ids.has(o.id)) o.locked = !o.locked; });
      });
      commitProject(next);
    },
    setMainBoard: (id) => {
      const next = withVariant(get().project, (variant) => {
        variant.objects.forEach((o) => {
          if (o.catalogId === 'digital-board' || o.catalogId === 'wall-board') o.properties = { ...o.properties, mainBoard: o.id === id };
        });
      });
      commitProject(next);
    },
    setWindowHeater: (id, enabled) => {
      const next = withVariant(get().project, (variant) => {
        const windowObject = variant.objects.find((o) => o.id === id && o.catalogId === 'window');
        if (!windowObject) return;
        windowObject.properties = { ...windowObject.properties, hasHeater: enabled };
        const existing = variant.objects.find((o) => o.properties?.associatedWindowId === id);
        if (enabled && !existing) {
          const heater = createObjectFromCatalog('heater', windowObject.xCm, windowObject.yCm, {
            wall: windowObject.wall,
            xCm: windowObject.xCm,
            yCm: windowObject.yCm,
            rotationDeg: windowObject.rotationDeg,
            widthCm: Math.min(windowObject.widthCm, 160),
            locked: true,
            properties: { heaterClearanceCm: variant.analysisSettings.heaterClearanceCm, associatedWindowId: id },
          });
          if (windowObject.wall === 'north') heater.yCm = 10;
          if (windowObject.wall === 'south') heater.yCm = variant.room.lengthCm - 10;
          if (windowObject.wall === 'west') heater.xCm = 10;
          if (windowObject.wall === 'east') heater.xCm = variant.room.widthCm - 10;
          variant.objects.push(heater);
        }
        if (!enabled) variant.objects = variant.objects.filter((o) => o.properties?.associatedWindowId !== id);
      });
      commitProject(next);
    },
    applyTemplate: (templateId, replaceStudentFurniture) => {
      const variant = active(get().project);
      const main = variant.objects.find((o) => o.properties?.mainBoard);
      const frontWall = main?.wall ?? 'north';
      const generated = generateTemplate(templateId, get().project.meta.targetStudentCount, variant.room, frontWall);
      const next = withVariant(get().project, (v) => {
        if (replaceStudentFurniture) v.objects = v.objects.filter((o) => !studentFurniture(o));
        v.objects.push(...generated);
      });
      commitProject(next);
      set({ selectedIds: [], mode: 'furniture' });
    },
    addVariant: () => {
      const project = deepClone(get().project);
      const variant = createDefaultVariant(`Variante ${project.variants.length + 1}`);
      project.variants.push(variant);
      project.activeVariantId = variant.id;
      project.updatedAt = new Date().toISOString();
      commitProject(project);
      set({ selectedIds: [] });
    },
    duplicateVariant: () => {
      const project = deepClone(get().project);
      const source = active(project);
      const copy = deepClone(source);
      copy.id = createId();
      copy.name = `${source.name} – Kopie`;
      copy.objects = copy.objects.map((o) => ({ ...o, id: createId() }));
      copy.zones = copy.zones.map((z) => ({ ...z, id: createId() }));
      project.variants.push(copy);
      project.activeVariantId = copy.id;
      commitProject(project);
      set({ selectedIds: [] });
    },
    renameVariant: (id, name) => {
      const project = deepClone(get().project);
      const variant = project.variants.find((v) => v.id === id);
      if (variant) variant.name = name.trim() || variant.name;
      commitProject(project);
    },
    deleteVariant: (id) => {
      const project = deepClone(get().project);
      if (project.variants.length <= 1) return;
      project.variants = project.variants.filter((v) => v.id !== id);
      if (project.activeVariantId === id) project.activeVariantId = project.variants[0].id;
      commitProject(project);
      set({ selectedIds: [] });
    },
    setActiveVariant: (id) => set((state) => ({ project: { ...state.project, activeVariantId: id }, selectedIds: [] })),
    updateAnalysisSettings: (patch) => {
      const next = withVariant(get().project, (variant) => { variant.analysisSettings = { ...variant.analysisSettings, ...patch }; });
      commitProject(next);
    },
    undo: () => set((state) => {
      if (!state.history.length) return state;
      const previous = state.history[state.history.length - 1];
      return { project: deepClone(previous.project), history: state.history.slice(0, -1), future: [{ project: deepClone(state.project) }, ...state.future].slice(0, 100), selectedIds: [] };
    }),
    redo: () => set((state) => {
      if (!state.future.length) return state;
      const next = state.future[0];
      return { project: deepClone(next.project), future: state.future.slice(1), history: [...state.history, { project: deepClone(state.project) }].slice(-100), selectedIds: [] };
    }),
    newProject: () => set({ project: createDefaultProject(), selectedIds: [], history: [], future: [] }),
    importProject: (input) => set({ project: sanitizeProject(input), selectedIds: [], history: [], future: [] }),
    markSaved: () => set({ lastSavedAt: new Date().toISOString() }),
  };
});
