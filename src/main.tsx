import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThreeDOverlay } from './components/ThreeDOverlay';

createRoot(document.getElementById('root')!).render(<StrictMode><App /><ThreeDOverlay /></StrictMode>);
