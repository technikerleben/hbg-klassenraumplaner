import {
  Accessibility, AlertTriangle, Download, FileDown, FileImage, FolderOpen, Grid3X3,
  Box, LayoutTemplate, Lock, Plus, Redo2, RotateCw, Save, Trash2, Undo2, ZoomIn, ZoomOut,
} from 'lucide-react';
import type { AppMode } from '../store/usePlannerStore';
import { usePlannerStore } from '../store/usePlannerStore';

interface ToolbarProps {
  onExportPng: () => void;
  onExportJpg: () => void;
  onExportPdf: (format: 'a4' | 'a3') => void;
  onPrint: () => void;
  onExportProject: () => void;
  onImportProject: () => void;
}

const modes: Array<{ id: AppMode; label: string; icon: typeof Grid3X3 }> = [
  { id: 'room', label: 'Raum', icon: Grid3X3 },
  { id: 'furniture', label: 'Möbel', icon: Plus },
  { id: 'templates', label: 'Vorlagen', icon: LayoutTemplate },
  { id: 'analysis', label: 'Prüfen', icon: AlertTriangle },
  { id: 'compare', label: 'Varianten', icon: Accessibility },
];

export function Toolbar({ onExportPng, onExportJpg, onExportPdf, onPrint, onExportProject, onImportProject }: ToolbarProps) {
  const mode = usePlannerStore((s) => s.mode);
  const setMode = usePlannerStore((s) => s.setMode);
  const undo = usePlannerStore((s) => s.undo);
  const redo = usePlannerStore((s) => s.redo);
  const history = usePlannerStore((s) => s.history);
  const future = usePlannerStore((s) => s.future);
  const deleteSelected = usePlannerStore((s) => s.deleteSelected);
  const duplicateSelected = usePlannerStore((s) => s.duplicateSelected);
  const rotateSelected = usePlannerStore((s) => s.rotateSelected);
  const toggleLockSelected = usePlannerStore((s) => s.toggleLockSelected);
  const selectedIds = usePlannerStore((s) => s.selectedIds);
  const showGrid = usePlannerStore((s) => s.showGrid);
  const setShowGrid = usePlannerStore((s) => s.setShowGrid);
  const zoom = usePlannerStore((s) => s.zoom);
  const setZoom = usePlannerStore((s) => s.setZoom);
  const newProject = usePlannerStore((s) => s.newProject);
  const title = usePlannerStore((s) => s.project.meta.title);
  const updateMeta = usePlannerStore((s) => s.updateMeta);

  return (
    <header className="toolbar">
      <div className="brand">
        <div className="brand-mark" role="img" aria-label="Logo-Platzhalter der Heinrich-Böll-Gesamtschule" title="Logo-Platzhalter – für die Veröffentlichung kann das offizielle HBG-Logo eingesetzt werden">HBG</div>
        <div className="brand-copy">
          <span className="brand-school">Heinrich-Böll-Gesamtschule Dortmund</span>
          <strong className="brand-title">Klassenraumplaner</strong>
          <input aria-label="Projektname" value={title} onChange={(e) => updateMeta({ title: e.target.value })} />
        </div>
      </div>

      <nav className="mode-tabs" aria-label="Arbeitsbereiche">
        {modes.map(({ id, label, icon: Icon }) => (
          <button key={id} className={mode === id ? 'active' : ''} onClick={() => setMode(id)} title={label}>
            <Icon size={18} /><span>{label}</span>
          </button>
        ))}
        <button onClick={() => window.dispatchEvent(new CustomEvent('hbg-open-3d'))} title="3D-Ansicht"><Box size={18} /><span>3D</span></button>
      </nav>

      <div className="tool-actions">
        <div className="button-group">
          <button onClick={undo} disabled={!history.length} title="Rückgängig"><Undo2 size={18} /></button>
          <button onClick={redo} disabled={!future.length} title="Wiederholen"><Redo2 size={18} /></button>
        </div>
        <div className="button-group">
          <button onClick={duplicateSelected} disabled={!selectedIds.length} title="Duplizieren"><Plus size={18} /></button>
          <button onClick={() => rotateSelected(90)} disabled={!selectedIds.length} title="Um 90° drehen"><RotateCw size={18} /></button>
          <button onClick={toggleLockSelected} disabled={!selectedIds.length} title="Sperren/entsperren"><Lock size={18} /></button>
          <button className="danger" onClick={deleteSelected} disabled={!selectedIds.length} title="Löschen"><Trash2 size={18} /></button>
        </div>
        <div className="button-group">
          <button className={showGrid ? 'active' : ''} onClick={() => setShowGrid(!showGrid)} title="Raster"><Grid3X3 size={18} /></button>
          <button onClick={() => setZoom(zoom - 0.1)} title="Verkleinern"><ZoomOut size={18} /></button>
          <span className="zoom-label">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(zoom + 0.1)} title="Vergrößern"><ZoomIn size={18} /></button>
        </div>
        <details className="export-menu">
          <summary title="Speichern und exportieren"><Download size={18} /><span>Export</span></summary>
          <div className="menu-popover">
            <button onClick={onExportProject}><Save size={17} /> Projektdatei</button>
            <button onClick={onImportProject}><FolderOpen size={17} /> Projekt öffnen</button>
            <hr />
            <button onClick={onExportPng}><FileImage size={17} /> PNG-Bild</button>
            <button onClick={onExportJpg}><FileImage size={17} /> JPG-Bild</button>
            <button onClick={() => onExportPdf('a4')}><FileDown size={17} /> PDF A4 · 1:50</button>
            <button onClick={() => onExportPdf('a3')}><FileDown size={17} /> PDF A3 · 1:50</button>
            <button onClick={onPrint}><FileDown size={17} /> Plan drucken</button>
          </div>
        </details>
        <button className="new-project" onClick={() => { if (confirm('Ein neues Projekt beginnen? Nicht exportierte Änderungen gehen verloren.')) newProject(); }} title="Neues Projekt">Neu</button>
      </div>
    </header>
  );
}
