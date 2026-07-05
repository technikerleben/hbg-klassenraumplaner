import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RoomSurveyAssistant as RoomSurveyAssistantContent } from './RoomSurveyAssistant';
import '../roomSurveyPortal.css';

interface RoomSurveyAssistantProps {
  open: boolean;
  onClose: () => void;
}

export function RoomSurveyAssistant({ open, onClose }: RoomSurveyAssistantProps) {
  useEffect(() => {
    if (!open) return;

    const root = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;
    const previousAriaHidden = root?.getAttribute('aria-hidden');
    const previousInert = root?.inert ?? false;

    document.body.style.overflow = 'hidden';
    root?.setAttribute('aria-hidden', 'true');
    if (root) root.inert = true;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (root) {
        root.inert = previousInert;
        if (previousAriaHidden === null) root.removeAttribute('aria-hidden');
        else root.setAttribute('aria-hidden', previousAriaHidden);
      }
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <RoomSurveyAssistantContent open={open} onClose={onClose} />,
    document.body,
  );
}
