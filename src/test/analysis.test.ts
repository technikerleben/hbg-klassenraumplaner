import { describe, expect, it } from 'vitest';
import { createObjectFromCatalog, wallPlacement } from '../data/catalog';
import { analyzeVariant } from '../lib/analysis';
import type { RoomVariant } from '../types/planner';

function variant(): RoomVariant {
  return {
    id: 'v1', name: 'Test', room: { widthCm: 900, lengthCm: 700 }, zones: [],
    analysisSettings: { aisleWidthCm: 100, heaterClearanceCm: 20, checkSightlines: false, checkWheelchair: false },
    objects: [],
  };
}

describe('Plananalyse', () => {
  it('meldet eine fehlende Tür', () => {
    const warnings = analyzeVariant(variant(), 0, false);
    expect(warnings.some((w) => w.ruleId === 'door-missing')).toBe(true);
  });

  it('meldet Möbelkollisionen', () => {
    const v = variant();
    v.objects.push(
      createObjectFromCatalog('door', 0, 0, { ...wallPlacement('west', 900, 700, 100, 8, 600) }),
      createObjectFromCatalog('desk-double', 300, 300),
      createObjectFromCatalog('desk-double', 330, 300),
    );
    const warnings = analyzeVariant(v, 4, false);
    expect(warnings.some((w) => w.ruleId === 'collision')).toBe(true);
  });

  it('meldet fehlende Lernplätze', () => {
    const v = variant();
    v.objects.push(createObjectFromCatalog('door', 0, 0, { ...wallPlacement('west', 900, 700, 100, 8, 600) }));
    const warnings = analyzeVariant(v, 30, false);
    expect(warnings.some((w) => w.ruleId === 'places-missing')).toBe(true);
  });
});
