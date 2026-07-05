import { useEffect } from 'react';
import { usePlannerStore } from '../store/usePlannerStore';
import '../iteration.css';

export function PlannerShortcuts() {
  const notice = usePlannerStore((state) => state.notice);
  const clearNotice = usePlannerStore((state) => state.clearNotice);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, select') || target.isContentEditable) return;
      const state = usePlannerStore.getState();
      if (!state.selectedIds.length) return;

      if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        event.stopPropagation();
        state.rotateSelected(90);
        return;
      }

      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      const distance = event.shiftKey ? 10 : 1;
      if (event.key === 'ArrowLeft') state.nudgeSelected(-distance, 0);
      if (event.key === 'ArrowRight') state.nudgeSelected(distance, 0);
      if (event.key === 'ArrowUp') state.nudgeSelected(0, -distance);
      if (event.key === 'ArrowDown') state.nudgeSelected(0, distance);
    };

    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(clearNotice, 3200);
    return () => window.clearTimeout(timer);
  }, [clearNotice, notice]);

  return notice ? <button className="app-toast" onClick={clearNotice} aria-live="polite">{notice}</button> : null;
}
