import { useState } from 'react';
import { TEMPLATES } from '../lib/templates';
import { usePlannerStore } from '../store/usePlannerStore';

export function TemplatesPanel() {
  const applyTemplate = usePlannerStore((s) => s.applyTemplate);
  const target = usePlannerStore((s) => s.project.meta.targetStudentCount);
  const updateMeta = usePlannerStore((s) => s.updateMeta);
  const [replace, setReplace] = useState(true);

  return (
    <aside className="left-panel templates-panel">
      <div className="panel-heading"><div><span className="eyebrow">Automatisch anordnen</span><h2>Sitzordnungen</h2></div></div>
      <label className="field"><span>Schülerzahl</span><input type="number" min={1} max={60} value={target} onChange={(e) => updateMeta({ targetStudentCount: Number(e.target.value) })} /></label>
      <label className="check-row"><input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} /><span>Vorhandene Schülertische und Stühle ersetzen</span></label>
      <div className="template-list">
        {TEMPLATES.map((template) => (
          <button key={template.id} className="template-card" onClick={() => applyTemplate(template.id, replace)}>
            <span className="template-icon">{template.icon}</span>
            <span><strong>{template.name}</strong><small>{template.description}</small></span>
          </button>
        ))}
      </div>
      <p className="panel-help">Die Vorschläge verwenden echte Möbelmaße. Passt eine Anordnung nicht in den Raum, werden Überschneidungen anschließend deutlich markiert.</p>
    </aside>
  );
}
