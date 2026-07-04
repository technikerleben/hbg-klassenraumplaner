import { Copy, Plus, Trash2 } from 'lucide-react';
import { variantStats } from '../lib/analysis';
import { usePlannerStore } from '../store/usePlannerStore';

export function VariantsPanel() {
  const project = usePlannerStore((s) => s.project);
  const addVariant = usePlannerStore((s) => s.addVariant);
  const duplicateVariant = usePlannerStore((s) => s.duplicateVariant);
  const renameVariant = usePlannerStore((s) => s.renameVariant);
  const deleteVariant = usePlannerStore((s) => s.deleteVariant);
  const setActiveVariant = usePlannerStore((s) => s.setActiveVariant);

  return <aside className="left-panel variants-panel">
    <div className="panel-heading"><div><span className="eyebrow">Vergleichen</span><h2>Raumvarianten</h2></div></div>
    <div className="variant-buttons"><button className="primary" onClick={addVariant}><Plus /> Leere Variante</button><button onClick={duplicateVariant}><Copy /> Aktive kopieren</button></div>
    <div className="variant-list">
      {project.variants.map((variant) => {
        const stats = variantStats(variant, project.meta.targetStudentCount, project.meta.wheelchairMode);
        const active = variant.id === project.activeVariantId;
        return <div key={variant.id} className={`variant-row ${active ? 'active' : ''}`}>
          <button className="variant-main" onClick={() => setActiveVariant(variant.id)}>
            <strong>{variant.name}</strong>
            <small>{stats.places} Plätze · {stats.critical} kritisch · {stats.warning} Hinweise</small>
          </button>
          <button className="icon-button" disabled={project.variants.length <= 1} onClick={() => deleteVariant(variant.id)} title="Variante löschen"><Trash2 /></button>
          {active && <input value={variant.name} onChange={(e) => renameVariant(variant.id, e.target.value)} aria-label="Variantenname" />}
        </div>;
      })}
    </div>
    <p className="panel-help">In der Vergleichsansicht erscheinen alle Varianten mit denselben Kennzahlen. Wähle eine Variante aus, um sie weiterzubearbeiten.</p>
  </aside>;
}
