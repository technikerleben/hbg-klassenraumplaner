export type ObjectKind = 'furniture' | 'wall' | 'zone' | 'symbol';
export type WallSide = 'north' | 'east' | 'south' | 'west';
export type Severity = 'critical' | 'warning' | 'info';
export type ObjectShape = 'rect' | 'round' | 'ellipse' | 'trapezoid' | 'bench' | 'sofa';
export type Category = 'tables' | 'seating' | 'storage' | 'presentation' | 'flexible' | 'fixed' | 'wet' | 'other';

export interface RoomGeometry {
  widthCm: number;
  lengthCm: number;
}

export interface PlannerObject {
  id: string;
  catalogId: string;
  kind: ObjectKind;
  category: Category;
  name: string;
  shape?: ObjectShape;
  xCm: number;
  yCm: number;
  widthCm: number;
  depthCm: number;
  rotationDeg: number;
  locked: boolean;
  collisionMode: 'solid' | 'warning' | 'ignore';
  wall?: WallSide;
  places?: number;
  color?: string;
  properties?: {
    hinge?: 'left' | 'right';
    openingAngleDeg?: number;
    mainBoard?: boolean;
    hasHeater?: boolean;
    heaterClearanceCm?: number;
    countsAsLearningPlace?: boolean;
    wheelchairPlace?: boolean;
    zoneMode?: 'allow' | 'warn' | 'keep-clear';
    tall?: boolean;
    label?: string;
    associatedWindowId?: string;
  };
}

export interface PlannerZone {
  id: string;
  name: string;
  xCm: number;
  yCm: number;
  widthCm: number;
  depthCm: number;
  color: string;
  opacity: number;
  mode: 'allow' | 'warn' | 'keep-clear';
  locked: boolean;
}

export interface AnalysisSettings {
  aisleWidthCm: number;
  heaterClearanceCm: number;
  checkSightlines: boolean;
  checkWheelchair: boolean;
}

export interface RoomVariant {
  id: string;
  name: string;
  note?: string;
  room: RoomGeometry;
  objects: PlannerObject[];
  zones: PlannerZone[];
  analysisSettings: AnalysisSettings;
}

export interface ProjectMeta {
  title: string;
  roomLabel: string;
  school: string;
  note: string;
  targetStudentCount: number;
  wheelchairMode: boolean;
}

export interface ProjectFile {
  schemaVersion: number;
  meta: ProjectMeta;
  activeVariantId: string;
  variants: RoomVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: Category;
  kind: ObjectKind;
  widthCm: number;
  depthCm: number;
  places?: number;
  color: string;
  shape?: ObjectShape;
  collisionMode?: 'solid' | 'warning' | 'ignore';
  wallBound?: boolean;
  tall?: boolean;
  description: string;
}

export interface PlannerWarning {
  id: string;
  severity: Severity;
  title: string;
  message: string;
  objectIds: string[];
  ruleId: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
}
