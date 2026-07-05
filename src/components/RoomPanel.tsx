import { useEffect, useState } from 'react';
import { Ruler } from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import { RoomSurveyAssistant } from './RoomSurveyPortal';
import '../roomAssistantCard.css';

export function RoomPanel() {
  const project = usePlannerStore((s) => s.project);
  const variant = usePlannerStore((s) => s.activeVariant());
  const updateMeta = usePlannerStore((s) => s.updateMeta);
  const updateRoom = usePlannerStore((s) => s.updateRoom);
  const addCatalogObject = usePlannerStore((s) => s.addCatalogObject);
  const [width, setWidth] = useState(variant.room.widthCm);
  const [length, setLength] = useState(variant.room.lengthCm);
  const [assistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    setWidth(variant.room.widthCm);
    setLength(variant.room.lengthCm);
  }, [variant.id, variant.room.widthCm, variant.room.lengthCm]);

  const apply = () => updateRoom(width, length);
  const doors = variant.objects.filter((object) => object.catalogId === 'door').length;
  const wetAreas = variant.objects.filter((object) => ['washbasin', 'wet-counter-120', 'wet-counter-180'].includes(object.catalogId)).length;
  const boards = variant.objects.filter((object) => ['digital-board', 'wall-board', 'pinboard'].includes(object.catalogId)).length;

  return (
    <aside className="left-panel">
      <div className="panel-heading"><div><span className="eyebrow">Schritt 1</span><h2>Raum festlegen</h2></div></div>

      <section className="room-assistant-card">
        <div className="room-assistant-icon"><Ruler size={22} /></div>
        <div><span className="eyebrow">Mit Maßband vor Ort</span><h3>Echten Raum vermessen</h3><p>Erfasse Raumname, Maße, Türen, Nassbereiche und fest installierte Tafeln Schritt für Schritt. Wand A bleibt immer die Türwand.</p></div>
        <button className="primary full" onClick={() => setAssistantOpen(true)}>Raum-Assistent starten</button>
      </section>

      <label className="field room-name-field"><span>Raumname</span><input value={project.meta.roomLabel} onChange={(event) => updateMeta({ roomLabel: event.target.value })} placeholder="z. B. B 2.14" /></label>
      <div className="room-dimensions">
        <label className="field"><span>Breite</span><div><input type="number" min={300} max={3000} value={width} onChange={(e) => setWidth(Number(e.target.value))} /><em>cm</em></div></label>
        <label className="field"><span>Länge</span><div><input type="number" min={300} max={3000} value={length} onChange={(e) => setLength(Number(e.target.value))} /><em>cm</em></div></label>
      </div>
      <button className="primary full" onClick={apply}>Raummaße übernehmen</button>
      <div className="room-facts"><span>Fläche</span><strong>{((variant.room.widthCm * variant.room.lengthCm) / 10000).toFixed(1)} m²</strong></div>

      {(project.meta.roomLabel || doors || wetAreas || boards) && <div className="survey-status-card">
        <strong>{project.meta.roomLabel || 'Aktueller Raum'}</strong>
        <span>{variant.room.widthCm} × {variant.room.lengthCm} cm</span>
        <div><small>{doors} Tür{doors === 1 ? '' : 'en'}</small><small>{wetAreas} Nassbereich{wetAreas === 1 ? '' : 'e'}</small><small>{boards} Tafel{boards === 1 ? '' : 'n'}</small></div>
        <button onClick={() => setAssistantOpen(true)}>Vermessung bearbeiten</button>
      </div>}

      <div className="room-orientation-mini">
        <div>Wand C</div><span>Wand D</span><figure><b>↑</b><small>Blick in den Raum</small></figure><span>Wand B</span><div><i>Tür</i> Wand A</div>
      </div>
      <p className="orientation-note">Wand A ist immer die Wand mit der wichtigsten Zugangstür. Der Blick in der Skizze verläuft von Wand A zu Wand C.</p>

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

      <RoomSurveyAssistant open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </aside>
  );
}
