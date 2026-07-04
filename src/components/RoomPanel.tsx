import { useState } from 'react';
import { usePlannerStore } from '../store/usePlannerStore';

export function RoomPanel() {
  const variant = usePlannerStore((s) => s.activeVariant());
  const updateRoom = usePlannerStore((s) => s.updateRoom);
  const addCatalogObject = usePlannerStore((s) => s.addCatalogObject);
  const [width, setWidth] = useState(variant.room.widthCm);
  const [length, setLength] = useState(variant.room.lengthCm);

  const apply = () => updateRoom(width, length);
  return (
    <aside className="left-panel">
      <div className="panel-heading"><div><span className="eyebrow">Schritt 1</span><h2>Raum festlegen</h2></div></div>
      <div className="room-dimensions">
        <label className="field"><span>Breite</span><div><input type="number" min={300} max={3000} value={width} onChange={(e) => setWidth(Number(e.target.value))} /><em>cm</em></div></label>
        <label className="field"><span>Länge</span><div><input type="number" min={300} max={3000} value={length} onChange={(e) => setLength(Number(e.target.value))} /><em>cm</em></div></label>
      </div>
      <button className="primary full" onClick={apply}>Raummaße übernehmen</button>
      <div className="room-facts"><span>Fläche</span><strong>{((variant.room.widthCm * variant.room.lengthCm) / 10000).toFixed(1)} m²</strong></div>
      <h3>Feste Elemente hinzufügen</h3>
      <div className="quick-add-grid">
        <button onClick={() => addCatalogObject('door')}>Tür</button>
        <button onClick={() => addCatalogObject('window')}>Fenster</button>
        <button onClick={() => addCatalogObject('digital-board')}>Digitale Tafel</button>
        <button onClick={() => addCatalogObject('wall-board')}>Wandtafel</button>
        <button onClick={() => addCatalogObject('heater')}>Heizkörper</button>
        <button onClick={() => addCatalogObject('washbasin')}>Waschbecken</button>
        <button onClick={() => addCatalogObject('wet-counter-180')}>Nasszeile</button>
        <button onClick={() => addCatalogObject('wet-zone')}>Nasszone</button>
      </div>
      <p className="panel-help">Feste Elemente werden zunächst an der oberen Wand eingesetzt. Wähle sie im Plan aus und ändere Wand, Position oder Maße rechts.</p>
    </aside>
  );
}
