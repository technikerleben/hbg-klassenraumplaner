import { Copy, Lock, RotateCw, Trash2, Unlock } from 'lucide-react';
import { wallPlacement } from '../data/catalog';
import { usePlannerStore } from '../store/usePlannerStore';
import type { PlannerObject, WallSide } from '../types/planner';

const walls: Array<{ id: WallSide; label: string }> = [
  { id: 'north', label: 'oben' }, { id: 'east', label: 'rechts' }, { id: 'south', label: 'unten' }, { id: 'west', label: 'links' },
];

export function PropertiesPanel() {
  const variant = usePlannerStore((s) => s.activeVariant());
  const selectedIds = usePlannerStore((s) => s.selectedIds);
  const updateObject = usePlannerStore((s) => s.updateObject);
  const duplicateSelected = usePlannerStore((s) => s.duplicateSelected);
  const deleteSelected = usePlannerStore((s) => s.deleteSelected);
  const rotateSelected = usePlannerStore((s) => s.rotateSelected);
  const toggleLockSelected = usePlannerStore((s) => s.toggleLockSelected);
  const setMainBoard = usePlannerStore((s) => s.setMainBoard);
  const setWindowHeater = usePlannerStore((s) => s.setWindowHeater);
  const object = selectedIds.length === 1 ? variant.objects.find((o) => o.id === selectedIds[0]) : undefined;

  if (!selectedIds.length) {
    return <aside className="right-panel empty-properties"><div className="empty-state large"><span className="selection-hint">↖</span><h3>Objekt auswählen</h3><p>Klicke im Plan auf ein Möbelstück oder einen festen Einbau. Hier erscheinen Position, Maße und weitere Einstellungen.</p></div></aside>;
  }

  if (!object) {
    return <aside className="right-panel"><div className="panel-heading"><div><span className="eyebrow">Mehrfachauswahl</span><h2>{selectedIds.length} Objekte</h2></div></div><div className="multi-actions"><button onClick={() => rotateSelected(90)}><RotateCw /> Drehen</button><button onClick={duplicateSelected}><Copy /> Duplizieren</button><button onClick={toggleLockSelected}><Lock /> Sperren</button><button className="danger" onClick={deleteSelected}><Trash2 /> Löschen</button></div></aside>;
  }

  const wallOffset = object.wall === 'north' || object.wall === 'south' ? object.xCm : object.yCm;
  const changeWall = (wall: WallSide) => updateObject(object.id, wallPlacement(wall, variant.room.widthCm, variant.room.lengthCm, object.widthCm, object.depthCm));
  const changeWallOffset = (offset: number) => object.wall && updateObject(object.id, wallPlacement(object.wall, variant.room.widthCm, variant.room.lengthCm, object.widthCm, object.depthCm, offset));
  const updateNumber = (key: keyof PlannerObject, value: number) => updateObject(object.id, { [key]: Number.isFinite(value) ? value : 0 } as Partial<PlannerObject>);

  return (
    <aside className="right-panel">
      <div className="panel-heading object-title">
        <div><span className="eyebrow">Ausgewähltes Objekt</span><h2>{object.name}</h2><small>{object.widthCm} × {object.depthCm} cm{object.places ? ` · ${object.places} Plätze` : ''}</small></div>
        <span className="object-color" style={{ background: object.color }} />
      </div>

      <div className="property-actions">
        <button onClick={() => rotateSelected(90)} disabled={object.kind === 'wall'}><RotateCw /> Drehen</button>
        <button onClick={duplicateSelected}><Copy /> Kopieren</button>
        <button onClick={toggleLockSelected}>{object.locked ? <Unlock /> : <Lock />} {object.locked ? 'Entsperren' : 'Sperren'}</button>
        <button className="danger" onClick={deleteSelected}><Trash2 /> Löschen</button>
      </div>

      {object.wall ? <>
        <h3>Position an der Wand</h3>
        <label className="field"><span>Wand</span><select value={object.wall} onChange={(e) => changeWall(e.target.value as WallSide)}>{walls.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}</select></label>
        <label className="field"><span>Abstand entlang der Wand</span><div><input type="number" value={Math.round(wallOffset)} onChange={(e) => changeWallOffset(Number(e.target.value))} /><em>cm</em></div></label>
        <label className="field"><span>Breite</span><div><input type="number" min={30} max={500} value={Math.round(object.widthCm)} onChange={(e) => {
          const widthCm = Number(e.target.value);
          updateObject(object.id, { widthCm, ...wallPlacement(object.wall!, variant.room.widthCm, variant.room.lengthCm, widthCm, object.depthCm, wallOffset) });
        }} /><em>cm</em></div></label>
      </> : <>
        <h3>Exakte Position</h3>
        <div className="two-fields">
          <label className="field"><span>Von links</span><div><input type="number" value={Math.round(object.xCm)} onChange={(e) => updateNumber('xCm', Number(e.target.value))} /><em>cm</em></div></label>
          <label className="field"><span>Von oben</span><div><input type="number" value={Math.round(object.yCm)} onChange={(e) => updateNumber('yCm', Number(e.target.value))} /><em>cm</em></div></label>
        </div>
        <label className="field"><span>Drehwinkel</span><div><input type="number" step={15} value={Math.round(object.rotationDeg)} onChange={(e) => updateNumber('rotationDeg', Number(e.target.value))} /><em>°</em></div></label>
      </>}

      {object.catalogId === 'door' && <>
        <h3>Tür</h3>
        <label className="segmented-label"><span>Türanschlag</span><div className="segmented"><button className={object.properties?.hinge !== 'right' ? 'active' : ''} onClick={() => updateObject(object.id, { properties: { hinge: 'left' } })}>links</button><button className={object.properties?.hinge === 'right' ? 'active' : ''} onClick={() => updateObject(object.id, { properties: { hinge: 'right' } })}>rechts</button></div></label>
        <label className="field"><span>Öffnungswinkel</span><div><input type="number" min={30} max={120} step={5} value={object.properties?.openingAngleDeg ?? 90} onChange={(e) => updateObject(object.id, { properties: { openingAngleDeg: Math.max(30, Math.min(120, Number(e.target.value))) } })} /><em>°</em></div></label>
        <p className="inline-note">Die Tür öffnet in der Planung immer nach innen. Der Winkel wird auch bei der Schwenkbereichsprüfung berücksichtigt.</p>
      </>}

      {(object.catalogId === 'digital-board' || object.catalogId === 'wall-board') && <label className="check-row prominent"><input type="checkbox" checked={Boolean(object.properties?.mainBoard)} onChange={() => setMainBoard(object.id)} /><span>Als Haupttafel verwenden</span></label>}

      {object.catalogId === 'window' && <label className="check-row prominent"><input type="checkbox" checked={Boolean(object.properties?.hasHeater)} onChange={(e) => setWindowHeater(object.id, e.target.checked)} /><span>Heizkörper unter dem Fenster</span></label>}

      {object.catalogId === 'heater' && <label className="field"><span>Freizone vor Heizkörper</span><div><input type="number" min={0} max={100} value={object.properties?.heaterClearanceCm ?? 20} onChange={(e) => updateObject(object.id, { properties: { heaterClearanceCm: Number(e.target.value) } })} /><em>cm</em></div></label>}

      {object.catalogId === 'note' && <label className="field"><span>Beschriftung</span><textarea value={object.properties?.label ?? ''} onChange={(e) => updateObject(object.id, { properties: { label: e.target.value } })} /></label>}

      <label className="field"><span>Anzeigename</span><input value={object.name} onChange={(e) => updateObject(object.id, { name: e.target.value })} /></label>
      <div className="object-meta"><span>Kollision</span><strong>{object.collisionMode === 'solid' ? 'wird geprüft' : object.collisionMode === 'warning' ? 'als Hinweis' : 'wird ignoriert'}</strong></div>
    </aside>
  );
}
