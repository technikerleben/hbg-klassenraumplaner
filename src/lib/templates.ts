import { createObjectFromCatalog } from '../data/catalog';
import type { PlannerObject, RoomGeometry, TemplateDefinition, WallSide } from '../types/planner';

export const TEMPLATES: TemplateDefinition[] = [
  { id: 'rows', name: 'Klassische Reihen', description: 'Doppeltische in geraden Reihen zur Tafel.', icon: '▦' },
  { id: 'staggered', name: 'Versetzte Reihen', description: 'Reihen mit leicht versetzten Tischen.', icon: '▤' },
  { id: 'exam', name: 'Prüfungsordnung', description: 'Einzeltische mit größeren Abständen.', icon: '⋮' },
  { id: 'pairs', name: 'Partnerreihen', description: 'Einzeltische paarweise nebeneinander.', icon: '⫶' },
  { id: 'groups4', name: 'Vierergruppen', description: 'Je zwei Doppeltische bilden eine Insel.', icon: '▦' },
  { id: 'groups6', name: 'Sechsergruppen', description: 'Tischinseln für sechs Lernende.', icon: '⬡' },
  { id: 'u-shape', name: 'U-Form', description: 'Freie Mitte und Blick zur Tafel.', icon: '∪' },
  { id: 'double-u', name: 'Doppel-U', description: 'Zwei U-förmige Tischreihen.', icon: '⩆' },
  { id: 'semicircle', name: 'Halbkreis', description: 'Tische fächerförmig zur Tafel.', icon: '◡' },
  { id: 'circle', name: 'Sitzkreis', description: 'Stühle ohne Tische im Kreis.', icon: '○' },
  { id: 'fishbone', name: 'Fischgräte', description: 'Leicht zur Mitte gedrehte Tischreihen.', icon: '≪' },
  { id: 'landscape', name: 'Lernlandschaft', description: 'Mischung aus Gruppen, Einzelplätzen und Präsentationsfläche.', icon: '⌘' },
];

interface LayoutContext {
  room: RoomGeometry;
  frontWall: WallSide;
  lateral: number;
  depth: number;
}

function context(room: RoomGeometry, frontWall: WallSide): LayoutContext {
  const horizontal = frontWall === 'north' || frontWall === 'south';
  return {
    room,
    frontWall,
    lateral: horizontal ? room.widthCm : room.lengthCm,
    depth: horizontal ? room.lengthCm : room.widthCm,
  };
}

function place(ctx: LayoutContext, lateralCm: number, depthCm: number, localRotation = 0) {
  const { room, frontWall } = ctx;
  switch (frontWall) {
    case 'north': return { xCm: lateralCm, yCm: depthCm, rotationDeg: localRotation };
    case 'south': return { xCm: room.widthCm - lateralCm, yCm: room.lengthCm - depthCm, rotationDeg: localRotation + 180 };
    case 'east': return { xCm: room.widthCm - depthCm, yCm: lateralCm, rotationDeg: localRotation + 90 };
    case 'west': return { xCm: depthCm, yCm: room.lengthCm - lateralCm, rotationDeg: localRotation - 90 };
  }
}

function make(catalogId: string, ctx: LayoutContext, lateral: number, depth: number, rotation = 0): PlannerObject {
  return createObjectFromCatalog(catalogId, 0, 0, { ...place(ctx, lateral, depth, rotation) });
}

function gridLayout(target: number, ctx: LayoutContext, catalogId: string, places: number, gapX: number, gapY: number, stagger = false) {
  const sample = createObjectFromCatalog(catalogId, 0, 0);
  const count = Math.ceil(target / places);
  const frontMargin = 190;
  const sideMargin = 70;
  const usableWidth = Math.max(sample.widthCm, ctx.lateral - 2 * sideMargin);
  const columns = Math.max(1, Math.floor((usableWidth + gapX) / (sample.widthCm + gapX)));
  const rows = Math.ceil(count / columns);
  const totalW = Math.min(columns, count) * sample.widthCm + Math.max(0, Math.min(columns, count) - 1) * gapX;
  const totalH = rows * sample.depthCm + Math.max(0, rows - 1) * gapY;
  const startX = Math.max(sideMargin + sample.widthCm / 2, (ctx.lateral - totalW) / 2 + sample.widthCm / 2);
  const startY = Math.max(frontMargin + sample.depthCm / 2, Math.min(frontMargin + sample.depthCm / 2, ctx.depth - totalH - 40 + sample.depthCm / 2));
  const objects: PlannerObject[] = [];
  for (let i = 0; i < count; i += 1) {
    const row = Math.floor(i / columns);
    const col = i % columns;
    const rowCount = Math.min(columns, count - row * columns);
    const rowWidth = rowCount * sample.widthCm + Math.max(0, rowCount - 1) * gapX;
    const rowStart = (ctx.lateral - rowWidth) / 2 + sample.widthCm / 2;
    const staggerShift = stagger && row % 2 ? Math.min(30, gapX / 2) : 0;
    objects.push(make(catalogId, ctx, rowStart + col * (sample.widthCm + gapX) + staggerShift, startY + row * (sample.depthCm + gapY)));
  }
  return objects;
}

function groupLayout(target: number, ctx: LayoutContext, size: 4 | 6) {
  const groups = Math.ceil(target / size);
  const groupW = size === 4 ? 160 : 220;
  const groupH = size === 4 ? 130 : 170;
  const gapX = 80;
  const gapY = 90;
  const columns = Math.max(1, Math.floor((ctx.lateral - 100 + gapX) / (groupW + gapX)));
  const objects: PlannerObject[] = [];
  for (let g = 0; g < groups; g += 1) {
    const row = Math.floor(g / columns);
    const col = g % columns;
    const rowCount = Math.min(columns, groups - row * columns);
    const totalW = rowCount * groupW + Math.max(0, rowCount - 1) * gapX;
    const cx = (ctx.lateral - totalW) / 2 + groupW / 2 + col * (groupW + gapX);
    const cy = 220 + groupH / 2 + row * (groupH + gapY);
    if (size === 4) {
      objects.push(make('desk-double', ctx, cx, cy - 27, 0));
      objects.push(make('desk-double', ctx, cx, cy + 27, 180));
    } else {
      objects.push(make('desk-double', ctx, cx, cy - 55, 0));
      objects.push(make('desk-double', ctx, cx - 65, cy + 25, 90));
      objects.push(make('desk-double', ctx, cx + 65, cy + 25, -90));
    }
  }
  return objects;
}

function uShape(target: number, ctx: LayoutContext, inset = 0) {
  const needed = Math.ceil(target / 2);
  const objects: PlannerObject[] = [];
  const sideMargin = 85 + inset;
  const front = 210 + inset;
  const back = ctx.depth - 85 - inset;
  const verticalLength = Math.max(150, back - front);
  const sideCount = Math.max(1, Math.floor(verticalLength / 115));
  let remaining = needed;
  for (let i = 0; i < sideCount && remaining > 0; i += 1) {
    const y = front + i * (verticalLength / Math.max(1, sideCount - 1));
    objects.push(make('desk-double', ctx, sideMargin, y, 90)); remaining -= 1;
    if (remaining > 0) { objects.push(make('desk-double', ctx, ctx.lateral - sideMargin, y, -90)); remaining -= 1; }
  }
  const backAvailable = ctx.lateral - 2 * (sideMargin + 90);
  const backCount = Math.max(1, Math.floor(backAvailable / 155));
  for (let i = 0; i < backCount && remaining > 0; i += 1) {
    const x = ctx.lateral / 2 - ((backCount - 1) * 155) / 2 + i * 155;
    objects.push(make('desk-double', ctx, x, back, 180)); remaining -= 1;
  }
  while (remaining > 0) {
    const x = ctx.lateral / 2 + (remaining % 2 ? -80 : 80);
    const y = back - 100 - Math.floor(remaining / 2) * 70;
    objects.push(make('desk-double', ctx, x, y, 180));
    remaining -= 1;
  }
  return objects;
}

function semicircle(target: number, ctx: LayoutContext) {
  const count = Math.ceil(target / 2);
  const centerX = ctx.lateral / 2;
  const centerY = 125;
  const radius = Math.min(ctx.lateral * 0.42, ctx.depth - 230);
  const objects: PlannerObject[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angle = 25 + t * 130;
    const rad = (angle * Math.PI) / 180;
    const x = centerX + Math.cos(rad) * radius;
    const y = centerY + Math.sin(rad) * radius;
    objects.push(make('desk-double', ctx, x, y, angle - 90));
  }
  return objects;
}

function circle(target: number, ctx: LayoutContext) {
  const count = Math.max(2, target);
  const cx = ctx.lateral / 2;
  const cy = ctx.depth / 2 + 40;
  const radius = Math.min(ctx.lateral, ctx.depth) * 0.34;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const rad = (angle * Math.PI) / 180;
    return make('chair', ctx, cx + Math.cos(rad) * radius, cy + Math.sin(rad) * radius, angle + 90);
  });
}

function landscape(target: number, ctx: LayoutContext) {
  const objects: PlannerObject[] = [];
  const groupTarget = Math.max(8, Math.floor(target * 0.65));
  objects.push(...groupLayout(groupTarget, ctx, 4));
  const remaining = Math.max(0, target - groupTarget);
  for (let i = 0; i < remaining; i += 1) {
    const side = i % 2 === 0 ? 55 : ctx.lateral - 55;
    const y = 225 + Math.floor(i / 2) * 85;
    objects.push(make('desk-single', ctx, side, y, i % 2 === 0 ? 90 : -90));
  }
  objects.push(make('carpet-small', ctx, ctx.lateral / 2, 120));
  objects.push(make('shelf-low', ctx, ctx.lateral - 70, ctx.depth - 55, 0));
  return objects;
}

export function generateTemplate(templateId: string, targetStudents: number, room: RoomGeometry, frontWall: WallSide = 'north'): PlannerObject[] {
  const ctx = context(room, frontWall);
  const target = Math.max(1, Math.min(60, targetStudents));
  switch (templateId) {
    case 'rows': return gridLayout(target, ctx, 'desk-double', 2, 55, 75);
    case 'staggered': return gridLayout(target, ctx, 'desk-double', 2, 65, 75, true);
    case 'exam': return gridLayout(target, ctx, 'desk-single', 1, 90, 95);
    case 'pairs': return gridLayout(target, ctx, 'desk-single', 1, 12, 80);
    case 'groups4': return groupLayout(target, ctx, 4);
    case 'groups6': return groupLayout(target, ctx, 6);
    case 'u-shape': return uShape(target, ctx, 0);
    case 'double-u': return [...uShape(Math.ceil(target * 0.6), ctx, 0), ...uShape(Math.floor(target * 0.4), ctx, 110)];
    case 'semicircle': return semicircle(target, ctx);
    case 'circle': return circle(target, ctx);
    case 'fishbone': {
      const rows = gridLayout(target, ctx, 'desk-double', 2, 70, 80);
      return rows.map((o) => ({ ...o, rotationDeg: o.xCm < ctx.lateral / 2 ? 18 : -18 }));
    }
    case 'landscape': return landscape(target, ctx);
    default: return gridLayout(target, ctx, 'desk-double', 2, 55, 75);
  }
}
