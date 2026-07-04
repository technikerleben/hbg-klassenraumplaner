import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CATALOG, CATEGORY_LABELS } from '../data/catalog';
import { usePlannerStore } from '../store/usePlannerStore';
import type { Category } from '../types/planner';

const categoryOrder: Category[] = ['tables', 'seating', 'storage', 'presentation', 'flexible', 'fixed', 'wet', 'other'];

export function CatalogPanel() {
  const addCatalogObject = usePlannerStore((s) => s.addCatalogObject);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({ tables: true, fixed: true, presentation: true });
  const groups = useMemo(() => categoryOrder.map((category) => ({
    category,
    items: CATALOG.filter((item) => item.category === category && `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())),
  })).filter((group) => group.items.length), [query]);

  return (
    <aside className="left-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">Bibliothek</span><h2>Möbel & Einbauten</h2></div>
      </div>
      <label className="search-field"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Möbel suchen …" /></label>
      <div className="catalog-groups">
        {groups.map(({ category, items }) => {
          const expanded = query ? true : open[category];
          return (
            <section className="catalog-section" key={category}>
              <button className="catalog-category" onClick={() => setOpen((v) => ({ ...v, [category]: !expanded }))}>
                <span>{CATEGORY_LABELS[category]}</span><b>{expanded ? '−' : '+'}</b>
              </button>
              {expanded && <div className="catalog-list">
                {items.map((item) => (
                  <button
                    className="catalog-item"
                    key={item.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/x-catalog-id', item.id)}
                    onClick={() => addCatalogObject(item.id)}
                    title={`${item.description}. Anklicken oder in den Raum ziehen.`}
                  >
                    <span className="catalog-swatch" style={{ background: item.color }} />
                    <span><strong>{item.name}</strong><small>{item.description}</small></span>
                    <i>+</i>
                  </button>
                ))}
              </div>}
            </section>
          );
        })}
      </div>
      <p className="panel-help">Klicke ein Element an oder ziehe es direkt in den Plan. Wandobjekte rasten automatisch an der nächsten Wand ein.</p>
    </aside>
  );
}
