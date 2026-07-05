import { useEffect, useRef } from 'react';
import { Box, X } from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import '../threeD.css';

type ViewerMessage =
  | { type: 'HBG_3D_READY' }
  | { type: 'HBG_SET_VARIANT'; variantId: string };

export function ThreeDView() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const project = usePlannerStore((state) => state.project);
  const setActiveVariant = usePlannerStore((state) => state.setActiveVariant);
  const setMode = usePlannerStore((state) => state.setMode);

  const sendProject = () => {
    iframeRef.current?.contentWindow?.postMessage({
      type: 'HBG_PROJECT',
      project,
    }, window.location.origin);
  };

  useEffect(() => {
    const receive = (event: MessageEvent<ViewerMessage>) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'HBG_3D_READY') sendProject();
      if (event.data?.type === 'HBG_SET_VARIANT') setActiveVariant(event.data.variantId);
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  });

  useEffect(() => {
    sendProject();
  }, [project]);

  return (
    <section className="three-d-view" aria-label="Dreidimensionale Klassenraumansicht">
      <div className="three-d-appbar">
        <div className="three-d-title">
          <Box size={22} />
          <div><span>Direkte Vorschau des aktuellen Plans</span><strong>Klassenraum in 3D</strong></div>
        </div>
        <button onClick={() => setMode('furniture')}><X size={18} /> 2D bearbeiten</button>
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
