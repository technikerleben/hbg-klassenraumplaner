import { useEffect, useRef, useState } from 'react';
import { Box, X } from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import '../threeD.css';

type ViewerMessage =
  | { type: 'HBG_3D_READY' }
  | { type: 'HBG_SET_VARIANT'; variantId: string };

export function ThreeDOverlay() {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const project = usePlannerStore((state) => state.project);
  const setActiveVariant = usePlannerStore((state) => state.setActiveVariant);

  const sendProject = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'HBG_PROJECT', project }, window.location.origin);
  };

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('hbg-open-3d', show);
    return () => window.removeEventListener('hbg-open-3d', show);
  }, []);

  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const receive = (event: MessageEvent<ViewerMessage>) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'HBG_3D_READY') sendProject();
      if (event.data?.type === 'HBG_SET_VARIANT') setActiveVariant(event.data.variantId);
    };
    window.addEventListener('keydown', keydown);
    window.addEventListener('message', receive);
    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('message', receive);
    };
  }, [open, setActiveVariant, project]);

  useEffect(() => {
    if (open) sendProject();
  }, [open, project]);

  if (!open) return null;

  return (
    <section className="three-d-overlay" aria-label="Dreidimensionale Klassenraumansicht">
      <div className="three-d-appbar">
        <div className="three-d-title">
          <Box size={22} />
          <div><span>Direkte Vorschau des aktuellen Plans</span><strong>Klassenraum in 3D</strong></div>
        </div>
        <button onClick={() => setOpen(false)}><X size={18} /> 2D bearbeiten</button>
      </div>
      <iframe
        ref={iframeRef}
        className="three-d-frame"
        src="/3d-viewer.html"
        title="Klassenraum in 3D"
        onLoad={sendProject}
        sandbox="allow-scripts allow-same-origin"
      />
    </section>
  );
}
