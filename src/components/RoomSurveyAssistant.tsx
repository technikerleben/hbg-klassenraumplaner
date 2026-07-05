import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, DoorOpen, Droplets, Plus, Ruler, Trash2, X } from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import {
  applyRoomSurvey,
  createRoomSurveyDraft,
  validateRoomSurvey,
  wallLengthCm,
  type RoomSurveyDraft,
  type SurveyBoard,
  type SurveyDoor,
  type SurveyWall,
  type SurveyWetArea,
} from '../lib/roomSurvey';
import '../roomSurvey.css';

interface RoomSurveyAssistantProps {
  open: boolean;
  onClose: () => void;
}

const walls: SurveyWall[] = ['A', 'B', 'C', 'D'];
const steps = ['Raum', 'Türen', 'Nassbereich', 'Tafeln', 'Kontrolle'];
const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

function NumberInput({ value, onChange, min = 0, max = 3000, label }: { value: number; onChange: (value: number) => void; min?: number; max?: number; label: string }) {
  return <label className="survey-field"><span>{label}</span><div><input type="number" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /><em>cm</em></div></label>;
}

function WallSelect({ value, onChange, disabled = false }: { value: SurveyWall; onChange: (wall: SurveyWall) => void; disabled?: boolean }) {
  return <label className="survey-field"><span>Wand</span><select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value as SurveyWall)}>{walls.map((wall) => <option key={wall} value={wall}>Wand {wall}</option>)}</select></label>;
}

function RoomOrientation() {
  return <div className="survey-orientation" aria-label="Raumorientierung mit Wand A als Türwand">
    <div className="wall-c">Wand C</div>
    <div className="wall-d">Wand D</div>
    <div className="survey-room-box"><span className="view-arrow">↑<small>Blick in den Raum</small></span></div>
    <div className="wall-b">Wand B</div>
    <div className="wall-a"><span>Tür</span> Wand A</div>
  </div>;
}

export function RoomSurveyAssistant({ open, onClose }: RoomSurveyAssistantProps) {
  const project = usePlannerStore((state) => state.project);
  const variant = usePlannerStore((state) => state.activeVariant());
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<RoomSurveyDraft>(() => createRoomSurveyDraft(project, variant));
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setDraft(createRoomSurveyDraft(project, variant));
    setStep(0);
    setErrors([]);
  }, [open]);

  const room = useMemo(() => ({ widthCm: draft.widthCm, lengthCm: draft.lengthCm }), [draft.widthCm, draft.lengthCm]);
  if (!open) return null;

  const patchDoor = (id: string, patch: Partial<SurveyDoor>) => setDraft((current) => ({ ...current, doors: current.doors.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  const patchWet = (id: string, patch: Partial<SurveyWetArea>) => setDraft((current) => ({ ...current, wetAreas: current.wetAreas.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  const patchBoard = (id: string, patch: Partial<SurveyBoard>) => setDraft((current) => ({ ...current, boards: current.boards.map((item) => item.id === id ? { ...item, ...patch } : item) }));

  const finish = () => {
    const nextErrors = validateRoomSurvey(draft);
    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }
    const state = usePlannerStore.getState();
    const nextProject = applyRoomSurvey(state.project, draft);
    usePlannerStore.setState((current) => ({
      project: nextProject,
      history: [...current.history.slice(-99), { project: structuredClone(current.project) }],
      future: [],
      selectedIds: [],
      notice: 'Raumvermessung übernommen. Wand A ist die Türwand.',
    }));
    onClose();
  };

  return <div className="survey-backdrop" role="dialog" aria-modal="true" aria-labelledby="survey-title">
    <section className="survey-dialog">
      <header className="survey-header">
        <div><span className="eyebrow">Geführte Vermessung</span><h2 id="survey-title">Raum-Assistent</h2></div>
        <button className="survey-close" onClick={onClose} aria-label="Assistent schließen"><X /></button>
      </header>

      <nav className="survey-progress" aria-label="Fortschritt">
        {steps.map((label, index) => <button key={label} className={index === step ? 'active' : index < step ? 'done' : ''} onClick={() => index <= step && setStep(index)}><span>{index < step ? <Check size={14} /> : index + 1}</span>{label}</button>)}
      </nav>

      <div className="survey-content">
        {step === 0 && <div className="survey-step two-column">
          <div>
            <span className="survey-kicker"><Ruler size={17} /> Vorbereitung und Grundmaße</span>
            <h3>Türwand als feste Orientierung</h3>
            <p>Wand A ist immer die Wand mit der wichtigsten Zugangstür. Stelle dich mit dem Rücken zu dieser Wand und blicke in den Raum. In der Skizze liegt Wand A deshalb immer unten.</p>
            <RoomOrientation />
            <div className="survey-tip"><strong>Messregel:</strong> Betrachte jedes Wandstück direkt von innen. Miss immer vom linken Ende der betrachteten Wand bis zur linken Kante des Einbaus.</div>
          </div>
          <div className="survey-form-card">
            <label className="survey-field"><span>Raumname</span><input value={draft.roomName} onChange={(event) => setDraft({ ...draft, roomName: event.target.value })} placeholder="z. B. B 2.14 oder Technikraum" /></label>
            <NumberInput label="Raumbreite von Wand D zu Wand B" value={draft.widthCm} min={300} onChange={(widthCm) => setDraft({ ...draft, widthCm })} />
            <NumberInput label="Raumlänge von Wand A zu Wand C" value={draft.lengthCm} min={300} onChange={(lengthCm) => setDraft({ ...draft, lengthCm })} />
            <div className="survey-fact"><span>Fläche</span><strong>{((draft.widthCm * draft.lengthCm) / 10000).toFixed(1)} m²</strong></div>
          </div>
        </div>}

        {step === 1 && <div className="survey-step">
          <span className="survey-kicker"><DoorOpen size={17} /> Türen aufnehmen</span>
          <h3>Die Haupttür liegt immer in Wand A</h3>
          <p>Die Position wird vom linken Ende der Wand gemessen, wenn du im Raum stehst und direkt auf die Wand blickst. Der Türanschlag wird ebenfalls vom Raum aus bestimmt.</p>
          <div className="survey-items">
            {draft.doors.map((door, index) => <article className="survey-item" key={door.id}>
              <div className="survey-item-head"><div><strong>{index === 0 ? 'Haupttür' : `Weitere Tür ${index}`}</strong><small>Wandlänge: {wallLengthCm(index === 0 ? 'A' : door.wall, room)} cm</small></div>{index > 0 && <button onClick={() => setDraft({ ...draft, doors: draft.doors.filter((item) => item.id !== door.id) })} aria-label="Tür entfernen"><Trash2 size={17} /></button>}</div>
              <div className="survey-grid">
                <WallSelect value={index === 0 ? 'A' : door.wall} disabled={index === 0} onChange={(wall) => patchDoor(door.id, { wall })} />
                <NumberInput label="Abstand von links" value={door.startCm} onChange={(startCm) => patchDoor(door.id, { startCm })} />
                <NumberInput label="Türbreite" value={door.widthCm} min={40} max={300} onChange={(widthCm) => patchDoor(door.id, { widthCm })} />
                <label className="survey-field"><span>Türanschlag</span><select value={door.hinge} onChange={(event) => patchDoor(door.id, { hinge: event.target.value as 'left' | 'right' })}><option value="left">links</option><option value="right">rechts</option></select></label>
                <label className="survey-field"><span>Bezeichnung</span><input value={door.name} onChange={(event) => patchDoor(door.id, { name: event.target.value })} /></label>
              </div>
            </article>)}
          </div>
          <button className="survey-add" onClick={() => setDraft({ ...draft, doors: [...draft.doors, { id: makeId('door'), wall: 'C', startCm: 80, widthCm: 100, hinge: 'left', openingAngleDeg: 90, name: 'Weitere Tür', primary: false }] })}><Plus size={17} /> Weitere Tür hinzufügen</button>
        </div>}

        {step === 2 && <div className="survey-step">
          <span className="survey-kicker"><Droplets size={17} /> Nassbereiche aufnehmen</span>
          <h3>Breite, Position und Tiefe erfassen</h3>
          <p>Die Tiefe beschreibt, wie weit der feste Nassbereich in den Raum hineinragt. Wasseranschlüsse selbst müssen nicht einzeln vermessen werden.</p>
          {!draft.wetAreas.length && <div className="survey-empty">Noch kein Nassbereich erfasst. Dieser Schritt kann übersprungen werden.</div>}
          <div className="survey-items">
            {draft.wetAreas.map((area, index) => <article className="survey-item" key={area.id}>
              <div className="survey-item-head"><strong>Nassbereich {index + 1}</strong><button onClick={() => setDraft({ ...draft, wetAreas: draft.wetAreas.filter((item) => item.id !== area.id) })} aria-label="Nassbereich entfernen"><Trash2 size={17} /></button></div>
              <div className="survey-grid">
                <label className="survey-field"><span>Art</span><select value={area.kind} onChange={(event) => patchWet(area.id, { kind: event.target.value as SurveyWetArea['kind'] })}><option value="washbasin">Waschbecken</option><option value="counter">Nass- oder Arbeitszeile</option></select></label>
                <WallSelect value={area.wall} onChange={(wall) => patchWet(area.id, { wall })} />
                <NumberInput label="Abstand von links" value={area.startCm} onChange={(startCm) => patchWet(area.id, { startCm })} />
                <NumberInput label="Breite" value={area.widthCm} min={30} onChange={(widthCm) => patchWet(area.id, { widthCm })} />
                <NumberInput label="Tiefe in den Raum" value={area.depthCm} min={10} max={250} onChange={(depthCm) => patchWet(area.id, { depthCm })} />
                <label className="survey-field"><span>Bezeichnung</span><input value={area.name} onChange={(event) => patchWet(area.id, { name: event.target.value })} /></label>
              </div>
            </article>)}
          </div>
          <button className="survey-add" onClick={() => setDraft({ ...draft, wetAreas: [...draft.wetAreas, { id: makeId('wet'), wall: 'B', startCm: 80, widthCm: 120, depthCm: 60, kind: 'counter', name: 'Nassbereich' }] })}><Plus size={17} /> Nassbereich hinzufügen</button>
        </div>}

        {step === 3 && <div className="survey-step">
          <span className="survey-kicker">▭ Fest installierte Tafeln</span>
          <h3>Jede Wandtafel einzeln aufnehmen</h3>
          <p>Die Haupttafel wird später für Sitzrichtung, Blickwinkelprüfung und die Kameraperspektive verwendet. Sie bestimmt nicht die Ausrichtung des Raumes – dafür bleibt ausschließlich Wand A zuständig.</p>
          {!draft.boards.length && <div className="survey-empty">Noch keine fest installierte Tafel erfasst.</div>}
          <div className="survey-items">
            {draft.boards.map((board, index) => <article className="survey-item" key={board.id}>
              <div className="survey-item-head"><strong>Tafel {index + 1}</strong><button onClick={() => setDraft({ ...draft, boards: draft.boards.filter((item) => item.id !== board.id) })} aria-label="Tafel entfernen"><Trash2 size={17} /></button></div>
              <div className="survey-grid">
                <label className="survey-field"><span>Art</span><select value={board.kind} onChange={(event) => patchBoard(board.id, { kind: event.target.value as SurveyBoard['kind'] })}><option value="digital-board">Digitale Tafel</option><option value="wall-board">Wandtafel oder Whiteboard</option><option value="pinboard">Pinnwand</option></select></label>
                <WallSelect value={board.wall} onChange={(wall) => patchBoard(board.id, { wall })} />
                <NumberInput label="Abstand von links" value={board.startCm} onChange={(startCm) => patchBoard(board.id, { startCm })} />
                <NumberInput label="Breite" value={board.widthCm} min={30} onChange={(widthCm) => patchBoard(board.id, { widthCm })} />
                <label className="survey-field"><span>Bezeichnung</span><input value={board.name} onChange={(event) => patchBoard(board.id, { name: event.target.value })} /></label>
                <label className="survey-main-board"><input type="radio" name="main-board" checked={board.mainBoard} onChange={() => setDraft({ ...draft, boards: draft.boards.map((item) => ({ ...item, mainBoard: item.id === board.id })) })} /><span>Als Haupttafel verwenden</span></label>
              </div>
            </article>)}
          </div>
          <button className="survey-add" onClick={() => setDraft({ ...draft, boards: [...draft.boards, { id: makeId('board'), wall: 'C', startCm: 150, widthCm: 200, kind: draft.boards.length ? 'wall-board' : 'digital-board', name: draft.boards.length ? 'Wandtafel' : 'Digitale Tafel', mainBoard: !draft.boards.length }] })}><Plus size={17} /> Tafel hinzufügen</button>
        </div>}

        {step === 4 && <div className="survey-step review-step">
          <span className="survey-kicker"><Check size={17} /> Angaben kontrollieren</span>
          <h3>{draft.roomName.trim() || 'Klassenraum'} übernehmen</h3>
          <RoomOrientation />
          <div className="survey-review-grid">
            <div><span>Raum</span><strong>{draft.widthCm} × {draft.lengthCm} cm</strong><small>{((draft.widthCm * draft.lengthCm) / 10000).toFixed(1)} m²</small></div>
            <div><span>Türen</span><strong>{draft.doors.length}</strong><small>Haupttür in Wand A</small></div>
            <div><span>Nassbereiche</span><strong>{draft.wetAreas.length}</strong><small>mit Tiefe erfasst</small></div>
            <div><span>Tafeln</span><strong>{draft.boards.length}</strong><small>{draft.boards.some((board) => board.mainBoard) ? 'Haupttafel festgelegt' : 'keine Haupttafel'}</small></div>
          </div>
          <div className="survey-checklist"><p>Kontrolliere im echten Raum:</p><label><input type="checkbox" /> Die Haupttür liegt unten in Wand A.</label><label><input type="checkbox" /> Wand B befindet sich beim Blick in den Raum rechts.</label><label><input type="checkbox" /> Alle Abstände wurden von der jeweils linken Wandecke gemessen.</label></div>
          {errors.length > 0 && <div className="survey-errors"><strong>Bitte korrigieren:</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
        </div>}
      </div>

      <footer className="survey-footer">
        <button onClick={step === 0 ? onClose : () => { setErrors([]); setStep(step - 1); }}><ArrowLeft size={17} /> {step === 0 ? 'Abbrechen' : 'Zurück'}</button>
        {step < steps.length - 1 ? <button className="primary" onClick={() => { setErrors([]); setStep(step + 1); }}>Weiter <ArrowRight size={17} /></button> : <button className="primary" onClick={finish}><Check size={17} /> Raum übernehmen</button>}
      </footer>
    </section>
  </div>;
}
