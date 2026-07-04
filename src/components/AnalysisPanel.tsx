import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { analyzeVariant, variantStats } from '../lib/analysis';
import { usePlannerStore } from '../store/usePlannerStore';

export function AnalysisPanel() {
  const project = usePlannerStore((s) => s.project);
  const variant = usePlannerStore((s) => s.activeVariant());
  const updateAnalysisSettings = usePlannerStore((s) => s.updateAnalysisSettings);
  const setSelected = usePlannerStore((s) => s.setSelected);
  const warnings = analyzeVariant(variant, project.meta.targetStudentCount, project.meta.wheelchairMode);
  const stats = variantStats(variant, project.meta.targetStudentCount, project.meta.wheelchairMode);

  return (
    <aside className="left-panel analysis-panel">
      <div className="panel-heading"><div><span className="eyebrow">Geometrische Planungshilfe</span><h2>Plan prüfen</h2></div></div>
      <div className={`plan-status ${stats.critical ? 'critical' : stats.warning ? 'warning' : 'ok'}`}>
        {stats.critical ? <AlertCircle /> : stats.warning ? <AlertTriangle /> : <CheckCircle2 />}
        <div><strong>{stats.critical ? 'Kritische Probleme vorhanden' : stats.warning ? 'Plan mit Empfehlungen' : 'Keine kritischen Warnungen erkannt'}</strong><small>{stats.places} Lernplätze für {project.meta.targetStudentCount} Lernende</small></div>
      </div>
      <label className="field"><span>Geprüfte Gangbreite</span><div><input type="number" min={60} max={200} step={10} value={variant.analysisSettings.aisleWidthCm} onChange={(e) => updateAnalysisSettings({ aisleWidthCm: Number(e.target.value) })} /><em>cm</em></div></label>
      <label className="check-row"><input type="checkbox" checked={variant.analysisSettings.checkSightlines} onChange={(e) => updateAnalysisSettings({ checkSightlines: e.target.checked })} /><span>Ausrichtung zur Haupttafel prüfen</span></label>
      <label className="check-row"><input type="checkbox" checked={variant.analysisSettings.checkWheelchair} onChange={(e) => updateAnalysisSettings({ checkWheelchair: e.target.checked })} /><span>Rollstuhl-Bewegungsfläche prüfen</span></label>
      <div className="warning-list">
        {!warnings.length && <div className="empty-state"><CheckCircle2 /><p>Für die aktivierten Regeln wurden keine Probleme gefunden.</p></div>}
        {warnings.map((w) => (
          <button key={w.id} className={`warning-card ${w.severity}`} onClick={() => setSelected(w.objectIds)}>
            {w.severity === 'critical' ? <AlertCircle /> : w.severity === 'warning' ? <AlertTriangle /> : <Info />}
            <span><strong>{w.title}</strong><small>{w.message}</small></span>
          </button>
        ))}
      </div>
      <div className="legal-note"><Info size={16} /><p>Die Prüfung ist eine geometrische Näherung. Sie ersetzt weder Brandschutzplanung noch Gefährdungsbeurteilung oder eine fachliche Freigabe.</p></div>
    </aside>
  );
}
