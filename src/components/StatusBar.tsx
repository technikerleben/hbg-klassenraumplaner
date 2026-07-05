import { analyzeVariant } from '../lib/analysis';
import { usePlannerStore } from '../store/usePlannerStore';
import { PlannerShortcuts } from './PlannerShortcuts';

export function StatusBar() {
  const project = usePlannerStore((s) => s.project);
  const variant = usePlannerStore((s) => s.activeVariant());
  const snap = usePlannerStore((s) => s.snapStepCm);
  const setSnap = usePlannerStore((s) => s.setSnapStep);
  const warnings = analyzeVariant(variant, project.meta.targetStudentCount, project.meta.wheelchairMode);
  const places = variant.objects.reduce((sum, o) => sum + (o.places ?? 0), 0);
  const critical = warnings.filter((w) => w.severity === 'critical').length;
  const other = warnings.length - critical;
  return <>
    <PlannerShortcuts />
    <footer className="status-bar">
      <div><strong>{places} von {project.meta.targetStudentCount}</strong> Lernplätzen</div>
      <div className={critical ? 'status-critical' : 'status-ok'}><strong>{critical}</strong> kritische Warnungen</div>
      <div><strong>{other}</strong> weitere Hinweise</div>
      <div className="status-spacer" />
      <label>Einrasten <select value={snap} onChange={(e) => setSnap(Number(e.target.value))}><option value={1}>1 cm</option><option value={5}>5 cm</option><option value={10}>10 cm</option></select></label>
      <div>{variant.objects.length} Objekte</div>
    </footer>
  </>;
}
