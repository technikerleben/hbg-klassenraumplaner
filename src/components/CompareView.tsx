import { variantStats } from '../lib/analysis';
import { usePlannerStore } from '../store/usePlannerStore';

export function CompareView() {
  const project = usePlannerStore((s) => s.project);
  const setActiveVariant = usePlannerStore((s) => s.setActiveVariant);
  const setMode = usePlannerStore((s) => s.setMode);
  return <main className="compare-view">
    <div className="compare-heading"><span className="eyebrow">Bis zu vier auf einen Blick</span><h1>Varianten vergleichen</h1><p>Die Miniaturen sind maßstäblich zueinander. Kennzahlen sind geometrische Planungshilfen.</p></div>
    <div className="compare-grid">
      {project.variants.slice(0, 8).map((variant) => {
        const stats = variantStats(variant, project.meta.targetStudentCount, project.meta.wheelchairMode);
        const max = Math.max(variant.room.widthCm, variant.room.lengthCm);
        const padX = (max - variant.room.widthCm) / 2;
        const padY = (max - variant.room.lengthCm) / 2;
        return <article key={variant.id} className="compare-card">
          <header><div><h2>{variant.name}</h2><small>{variant.room.widthCm / 100} × {variant.room.lengthCm / 100} m</small></div><span className={stats.critical ? 'status-dot critical' : stats.warning ? 'status-dot warning' : 'status-dot ok'} /></header>
          <svg viewBox={`0 0 ${max} ${max}`} role="img" aria-label={`Grundriss ${variant.name}`}>
            <rect x={padX} y={padY} width={variant.room.widthCm} height={variant.room.lengthCm} fill="#FFFFFF" stroke="#163A5C" strokeWidth={max / 160} />
            {variant.objects.map((o) => <rect key={o.id} x={padX + o.xCm - o.widthCm / 2} y={padY + o.yCm - o.depthCm / 2} width={o.widthCm} height={o.depthCm} rx={max / 180} fill={o.color} opacity={o.kind === 'zone' ? .25 : .85} transform={`rotate(${o.rotationDeg} ${padX + o.xCm} ${padY + o.yCm})`} />)}
          </svg>
          <div className="stat-grid"><span><b>{stats.places}</b> Plätze</span><span><b>{stats.critical}</b> kritisch</span><span><b>{stats.warning}</b> Warnungen</span><span><b>{stats.areaM2.toFixed(1)}</b> m²</span></div>
          <button onClick={() => { setActiveVariant(variant.id); setMode('furniture'); }}>Diese Variante bearbeiten</button>
        </article>;
      })}
    </div>
  </main>;
}
