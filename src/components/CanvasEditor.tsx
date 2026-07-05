import { useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactElement } from 'react';
import Konva from 'konva';
import { Circle, Ellipse, Group, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { analyzeVariant } from '../lib/analysis';
import { nearestWall, resolveObjectShape, trapezoidPoints } from '../lib/geometry';
import { wallPlacement } from '../data/catalog';
import { usePlannerStore } from '../store/usePlannerStore';
import type { PlannerObject, PlannerWarning } from '../types/planner';

const HBG = {
  rot: '#791D22',
  blauDunkel: '#163A5C',
  blau: '#245688',
  blauMittel: '#6C93B8',
  blauBlass: '#CBDBE9',
  blauGhost: '#EFF4F9',
  gruenDunkel: '#2F4A38',
  gruen: '#3F6B4D',
  gruenBlass: '#D6E3D2',
  text: '#2B2B2B',
  border: '#D9D5CF',
  bg: '#F7F5F2',
  fehler: '#A62B2B',
  warnung: '#B8791E',
  erfolg: '#2E6E6E',
};

function textColorForFill(hex: string | undefined, isZone: boolean) {
  if (!hex || isZone) return HBG.text;
  const value = hex.replace('#', '');
  if (value.length !== 6) return HBG.text;
  const [r, g, b] = [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16) / 255);
  const linear = [r, g, b].map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  return luminance < 0.3 ? '#FFFFFF' : HBG.text;
}

interface CanvasEditorProps { stageRef: MutableRefObject<Konva.Stage | null> }

function warningMap(warnings: PlannerWarning[]) {
  const priority = { info: 1, warning: 2, critical: 3 } as const;
  const map = new Map<string, PlannerWarning['severity']>();
  warnings.forEach((w) => w.objectIds.forEach((id) => {
    const current = map.get(id);
    if (!current || priority[w.severity] > priority[current]) map.set(id, w.severity);
  }));
  return map;
}

function arcPoints(hingeLeft: boolean, width: number, openingAngleDeg: number) {
  const points: number[] = [];
  const opening = Math.max(0, Math.min(180, openingAngleDeg)) * Math.PI / 180;
  for (let i = 0; i <= 20; i += 1) {
    const t = i / 20;
    const angle = hingeLeft ? t * opening : Math.PI - t * opening;
    points.push(Math.cos(angle) * width, Math.sin(angle) * width);
  }
  return points;
}

function doorLeafEnd(hingeLeft: boolean, width: number, openingAngleDeg: number) {
  const opening = Math.max(0, Math.min(180, openingAngleDeg)) * Math.PI / 180;
  const angle = hingeLeft ? opening : Math.PI - opening;
  return { x: Math.cos(angle) * width, y: Math.sin(angle) * width };
}

function LockMarker({ object, inverseScale }: { object: PlannerObject; inverseScale: number }) {
  const x = object.widthCm / 2 - 12 * inverseScale;
  const y = -object.depthCm / 2 + 5 * inverseScale;
  return <Group x={x} y={y} listening={false}>
    <Rect x={-6 * inverseScale} y={0} width={12 * inverseScale} height={9 * inverseScale} cornerRadius={2 * inverseScale} fill="#FFFFFF" stroke="#163A5C" strokeWidth={1.5 * inverseScale} />
    <Line points={[-4 * inverseScale, 0, -4 * inverseScale, -3 * inverseScale, 0, -6 * inverseScale, 4 * inverseScale, -3 * inverseScale, 4 * inverseScale, 0]} stroke="#163A5C" strokeWidth={1.5 * inverseScale} lineCap="round" lineJoin="round" />
  </Group>;
}

function AttachedSeats({ object, inverseScale }: { object: PlannerObject; inverseScale: number }) {
  const count = object.catalogId === 'chair' || object.catalogId === 'stool' ? 0 : object.places ?? 0;
  if (!count) return null;
  const seatW = Math.min(34, object.widthCm / Math.max(2, count));
  const seats: Array<{ x: number; y: number; r: number }> = [];
  if (count <= 2) {
    for (let i = 0; i < count; i += 1) seats.push({ x: (i - (count - 1) / 2) * Math.min(55, object.widthCm / count), y: object.depthCm / 2 + 13, r: 0 });
  } else {
    const top = Math.ceil(count / 2);
    for (let i = 0; i < top; i += 1) seats.push({ x: (i - (top - 1) / 2) * Math.min(48, object.widthCm / top), y: object.depthCm / 2 + 13, r: 0 });
    for (let i = 0; i < count - top; i += 1) seats.push({ x: (i - (count - top - 1) / 2) * Math.min(48, object.widthCm / Math.max(1, count - top)), y: -object.depthCm / 2 - 13, r: 180 });
  }
  return <>{seats.map((s, i) => <Group key={i} x={s.x} y={s.y} rotation={s.r}><Rect x={-seatW / 2} y={-8} width={seatW} height={16} cornerRadius={5} fill="#D6E3D2" stroke="#2F4A38" strokeWidth={1.2 * inverseScale} /><Line points={[-seatW / 2, 0, seatW / 2, 0]} stroke="#2F4A38" strokeWidth={1 * inverseScale} /></Group>)}</>;
}

function ObjectShape({ object, selected, severity, inverseScale, mode, room, onSelect, onMoveEnd }: {
  object: PlannerObject; selected: boolean; severity?: PlannerWarning['severity']; inverseScale: number; mode: string; room: { widthCm: number; lengthCm: number };
  onSelect: (event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onMoveEnd: (x: number, y: number) => void;
}) {
  const draggable = !object.locked || mode === 'room';
  const warningColor = severity === 'critical' ? '#A62B2B' : severity === 'warning' ? '#B8791E' : severity === 'info' ? '#245688' : undefined;
  const shape = resolveObjectShape(object);
  const openingAngle = object.properties?.openingAngleDeg ?? 90;
  const hingeLeft = object.properties?.hinge !== 'right';
  const hingeX = hingeLeft ? -object.widthCm / 2 : object.widthCm / 2;
  const leafEnd = doorLeafEnd(hingeLeft, object.widthCm, openingAngle);
  const label = object.catalogId === 'note' ? object.properties?.label ?? object.name : object.name;

  return <Group
    id={object.id}
    x={object.xCm}
    y={object.yCm}
    rotation={object.rotationDeg}
    draggable={draggable}
    onClick={onSelect}
    onTap={onSelect}
    onDblClick={() => !object.wall && onMoveEnd(object.xCm, object.yCm)}
    onDragEnd={(e) => onMoveEnd(e.target.x(), e.target.y())}
  >
    {object.catalogId === 'door' ? <>
      <Line points={[-object.widthCm / 2, 0, object.widthCm / 2, 0]} stroke="#F7F5F2" strokeWidth={9 * inverseScale} />
      <Line points={[hingeX, 0, hingeX + leafEnd.x, leafEnd.y]} stroke={object.color} strokeWidth={3 * inverseScale} />
      <Line x={hingeX} points={arcPoints(hingeLeft, object.widthCm, openingAngle)} stroke={object.color} strokeWidth={1.5 * inverseScale} dash={[5 * inverseScale, 4 * inverseScale]} />
    </> : object.catalogId === 'window' ? <>
      <Line points={[-object.widthCm / 2, -3, object.widthCm / 2, -3]} stroke="#6C93B8" strokeWidth={3 * inverseScale} />
      <Line points={[-object.widthCm / 2, 3, object.widthCm / 2, 3]} stroke="#6C93B8" strokeWidth={3 * inverseScale} />
    </> : shape === 'round' ? <Circle radius={object.widthCm / 2} fill={object.color} opacity={object.kind === 'zone' ? 0.28 : 0.9} stroke="#163A5C" strokeWidth={1.4 * inverseScale} />
      : shape === 'ellipse' ? <Ellipse radiusX={object.widthCm / 2} radiusY={object.depthCm / 2} fill={object.color} opacity={0.9} stroke="#163A5C" strokeWidth={1.4 * inverseScale} />
      : shape === 'trapezoid' ? <Line closed points={trapezoidPoints(object.widthCm, object.depthCm)} fill={object.color} opacity={0.9} stroke="#163A5C" strokeWidth={1.4 * inverseScale} lineJoin="round" />
      : shape === 'bench' ? <Group><Rect x={-object.widthCm / 2} y={-object.depthCm / 2} width={object.widthCm} height={object.depthCm} cornerRadius={5} fill={object.color} opacity={0.9} stroke="#163A5C" strokeWidth={1.4 * inverseScale} /><Line points={[-object.widthCm / 2 + 5, -object.depthCm / 2 + 8, object.widthCm / 2 - 5, -object.depthCm / 2 + 8]} stroke="#2F4A38" strokeWidth={3 * inverseScale} /></Group>
      : shape === 'sofa' ? <Group><Rect x={-object.widthCm / 2} y={-object.depthCm / 2} width={object.widthCm} height={object.depthCm} cornerRadius={12} fill={object.color} opacity={0.9} stroke="#163A5C" strokeWidth={1.4 * inverseScale} /><Rect x={-object.widthCm / 2 + 8} y={-object.depthCm / 2 + 7} width={object.widthCm - 16} height={16} cornerRadius={6} fill="#D6E3D2" stroke="#2F4A38" strokeWidth={1.2 * inverseScale} /><Line points={[-object.widthCm / 2 + 18, -object.depthCm / 2 + 24, -object.widthCm / 2 + 18, object.depthCm / 2 - 8]} stroke="#2F4A38" strokeWidth={4 * inverseScale} /><Line points={[object.widthCm / 2 - 18, -object.depthCm / 2 + 24, object.widthCm / 2 - 18, object.depthCm / 2 - 8]} stroke="#2F4A38" strokeWidth={4 * inverseScale} /></Group>
      : <Rect x={-object.widthCm / 2} y={-object.depthCm / 2} width={object.widthCm} height={object.depthCm} cornerRadius={object.kind === 'zone' ? 10 : 4} fill={object.color} opacity={object.kind === 'zone' ? 0.28 : object.kind === 'symbol' ? 0.75 : 0.9} stroke="#163A5C" strokeWidth={1.4 * inverseScale} dash={object.kind === 'zone' ? [7 * inverseScale, 4 * inverseScale] : undefined} />}
    <AttachedSeats object={object} inverseScale={inverseScale} />
    {object.catalogId !== 'door' && object.catalogId !== 'window' && <Text text={label} width={Math.max(50, object.widthCm - 8)} x={-Math.max(50, object.widthCm - 8) / 2} y={-7 * inverseScale} align="center" fontFamily="Glacial Indifference, Jost, Mulish, Helvetica Neue, Arial, sans-serif" fontSize={11 * inverseScale} fill={textColorForFill(object.color, object.kind === 'zone')} listening={false} />}
    {selected && <Rect x={-object.widthCm / 2 - 6 * inverseScale} y={-object.depthCm / 2 - 6 * inverseScale} width={object.widthCm + 12 * inverseScale} height={object.depthCm + 12 * inverseScale} stroke="#791D22" strokeWidth={3 * inverseScale} dash={[8 * inverseScale, 4 * inverseScale]} cornerRadius={6 * inverseScale} listening={false} />}
    {warningColor && <Rect x={-object.widthCm / 2 - 3 * inverseScale} y={-object.depthCm / 2 - 3 * inverseScale} width={object.widthCm + 6 * inverseScale} height={object.depthCm + 6 * inverseScale} stroke={warningColor} strokeWidth={3 * inverseScale} cornerRadius={5 * inverseScale} listening={false} />}
    {object.locked && <LockMarker object={object} inverseScale={inverseScale} />}
  </Group>;
}

export function CanvasEditor({ stageRef }: CanvasEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 900, height: 650 });
  const project = usePlannerStore((s) => s.project);
  const variant = usePlannerStore((s) => s.activeVariant());
  const selectedIds = usePlannerStore((s) => s.selectedIds);
  const setSelected = usePlannerStore((s) => s.setSelected);
  const toggleSelected = usePlannerStore((s) => s.toggleSelected);
  const moveObject = usePlannerStore((s) => s.moveObject);
  const updateObject = usePlannerStore((s) => s.updateObject);
  const addObjectAt = usePlannerStore((s) => s.addObjectAt);
  const showGrid = usePlannerStore((s) => s.showGrid);
  const showAnalysis = usePlannerStore((s) => s.showAnalysis);
  const mode = usePlannerStore((s) => s.mode);
  const zoom = usePlannerStore((s) => s.zoom);
  const snapStepCm = usePlannerStore((s) => s.snapStepCm);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    void document.fonts.ready.then(() => stageRef.current?.batchDraw());
  }, [stageRef]);

  const margin = 58;
  const baseScale = Math.min((size.width - margin * 2) / variant.room.widthCm, (size.height - margin * 2) / variant.room.lengthCm);
  const scale = Math.max(0.05, baseScale * zoom);
  const renderedWidth = variant.room.widthCm * scale;
  const renderedHeight = variant.room.lengthCm * scale;
  const offsetX = (size.width - renderedWidth) / 2;
  const offsetY = (size.height - renderedHeight) / 2;
  const inverseScale = 1 / scale;
  const warnings = useMemo(() => analyzeVariant(variant, project.meta.targetStudentCount, project.meta.wheelchairMode), [variant, project.meta.targetStudentCount, project.meta.wheelchairMode]);
  const objectWarnings = useMemo(() => warningMap(warnings), [warnings]);
  const scaleUnitCm = [50, 100, 200, 500].reduce((best, value) => Math.abs(value * scale - 90) < Math.abs(best * scale - 90) ? value : best, 100);
  const scaleUnitLabel = scaleUnitCm >= 100 ? `${scaleUnitCm / 100} m` : `${scaleUnitCm} cm`;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.setAttr('planExportRect', { x: offsetX, y: offsetY, width: renderedWidth, height: renderedHeight });
  }, [stageRef, offsetX, offsetY, renderedWidth, renderedHeight]);
  const gridLines = useMemo(() => {
    const lines: ReactElement[] = [];
    if (!showGrid) return lines;
    for (let x = 0; x <= variant.room.widthCm; x += 10) lines.push(<Line key={`x${x}`} points={[x, 0, x, variant.room.lengthCm]} stroke={x % 50 === 0 ? '#CBDBE9' : '#EFF4F9'} strokeWidth={(x % 50 === 0 ? 0.8 : 0.35) * inverseScale} listening={false} />);
    for (let y = 0; y <= variant.room.lengthCm; y += 10) lines.push(<Line key={`y${y}`} points={[0, y, variant.room.widthCm, y]} stroke={y % 50 === 0 ? '#CBDBE9' : '#EFF4F9'} strokeWidth={(y % 50 === 0 ? 0.8 : 0.35) * inverseScale} listening={false} />);
    return lines;
  }, [showGrid, variant.room.widthCm, variant.room.lengthCm, inverseScale]);

  const drop = (e: React.DragEvent) => {
    e.preventDefault();
    const catalogId = e.dataTransfer.getData('application/x-catalog-id');
    if (!catalogId || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const xCm = (e.clientX - rect.left - offsetX) / scale;
    const yCm = (e.clientY - rect.top - offsetY) / scale;
    addObjectAt(catalogId, xCm, yCm);
  };

  return <main className="canvas-shell" ref={wrapperRef} onDrop={drop} onDragOver={(e) => e.preventDefault()}>
    <Stage width={size.width} height={size.height} ref={(node) => { stageRef.current = node; }} onMouseDown={(e) => { if (e.target === e.target.getStage()) setSelected([]); }} onTouchStart={(e) => { if (e.target === e.target.getStage()) setSelected([]); }}>
      <Layer>
        <Rect x={0} y={0} width={size.width} height={size.height} fill="#F7F5F2" listening={false} />
        <Group x={offsetX} y={offsetY} scaleX={scale} scaleY={scale}>
          <Rect x={0} y={0} width={variant.room.widthCm} height={variant.room.lengthCm} fill="#FFFFFF" shadowColor="#163A5C" shadowBlur={18 * inverseScale} shadowOpacity={0.18} shadowOffsetY={6 * inverseScale} listening={false} />
          <Group clipX={0} clipY={0} clipWidth={variant.room.widthCm} clipHeight={variant.room.lengthCm}>{gridLines}</Group>
          <Rect x={0} y={0} width={variant.room.widthCm} height={variant.room.lengthCm} stroke="#163A5C" strokeWidth={8 * inverseScale} listening={false} />
          {variant.objects.map((object) => <ObjectShape
            key={object.id}
            object={object}
            selected={selectedIds.includes(object.id)}
            severity={showAnalysis ? objectWarnings.get(object.id) : undefined}
            inverseScale={inverseScale}
            mode={mode}
            room={variant.room}
            onSelect={(event) => {
              event.cancelBubble = true;
              const native = event.evt as MouseEvent;
              if (native.shiftKey || native.ctrlKey || native.metaKey) toggleSelected(object.id); else setSelected([object.id]);
            }}
            onMoveEnd={(x, y) => {
              if (object.wall) {
                const wall = nearestWall(x, y, variant.room);
                const along = wall === 'north' || wall === 'south' ? x : y;
                updateObject(object.id, wallPlacement(wall, variant.room.widthCm, variant.room.lengthCm, object.widthCm, object.depthCm, along));
              } else moveObject(object.id, x, y);
            }}
          />)}
          <Text text={`${variant.room.widthCm} cm`} x={0} y={-30 * inverseScale} width={variant.room.widthCm} align="center" fontFamily="Glacial Indifference, Jost, Mulish, Helvetica Neue, Arial, sans-serif" fontSize={13 * inverseScale} fill="#163A5C" listening={false} />
          <Text text={`${variant.room.lengthCm} cm`} x={-46 * inverseScale} y={0} width={variant.room.lengthCm} rotation={-90} align="center" fontFamily="Glacial Indifference, Jost, Mulish, Helvetica Neue, Arial, sans-serif" fontSize={13 * inverseScale} fill="#163A5C" listening={false} />
        </Group>
      </Layer>
    </Stage>
    <div className="canvas-badge">10-cm-Raster · Einrasten {snapStepCm} cm · Objektfang aktiv</div>
    <div className="scale-legend"><span>{scaleUnitLabel}</span><i style={{ width: `${scaleUnitCm * scale}px` }} /></div>
  </main>;
}
