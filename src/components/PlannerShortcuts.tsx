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
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      const state = usePlannerStore.getState();
      if (!state.selectedIds.length) return;
      event.preventDefault();
      const distance = event.shiftKey ? 10 : 1;
      if (event.key === 'ArrowLeft') state.nudgeSelected(-distance, 0);
      if (event.key === 'ArrowRight') state.nudgeSelected(distance, 0);
      if (event.key === 'ArrowUp') state.nudgeSelected(0, -distance);
      if (event.key === 'ArrowDown') state.nudgeSelected(0, distance);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(clearNotice, 3200);
    return () => window.clearTimeout(timer);
  }, [clearNotice, notice]);

  return notice ? <button className="app-toast" onClick={clearNotice}>{notice}</button> : null;
}
