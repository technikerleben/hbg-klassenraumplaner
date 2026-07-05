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
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousRootVisibility = root?.style.visibility ?? '';
    const previousRootPointerEvents = root?.style.pointerEvents ?? '';
    const previousAriaHidden = root ? root.getAttribute('aria-hidden') : null;
    const previousInert = root?.inert ?? false;

    document.body.classList.add('room-survey-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (root) {
      root.style.visibility = 'hidden';
      root.style.pointerEvents = 'none';
      root.setAttribute('aria-hidden', 'true');
      root.inert = true;
    }

    const roomNameInput = document.querySelector<HTMLInputElement>(
      '.room-survey-portal-layer input[placeholder="z. B. B 2.14 oder Technikraum"]',
    );
    if (roomNameInput) roomNameInput.placeholder = 'z. B. A201 oder C105';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.classList.remove('room-survey-open');
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      if (root) {
        root.style.visibility = previousRootVisibility;
        root.style.pointerEvents = previousRootPointerEvents;
        root.inert = previousInert;
        if (previousAriaHidden === null) root.removeAttribute('aria-hidden');
        else root.setAttribute('aria-hidden', previousAriaHidden);
      }

      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="room-survey-portal-layer">
      <RoomSurveyAssistantContent open={open} onClose={onClose} />
    </div>,
    document.body,
  );
}
