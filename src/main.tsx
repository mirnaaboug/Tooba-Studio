import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './ds/tokens/fonts.css';
import './ds/tokens/colors.css';
import './ds/tokens/typography.css';
import './ds/tokens/spacing.css';
import './ds/tokens/assets.css';
import './app.css';
import App from './App';

// /studio is the team's internal app; everything else is the client onboarding.
const StudioApp = lazy(() => import('./studio/StudioApp'));
const isStudio = /^\/studio(\/|$)/.test(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isStudio ? <Suspense fallback={null}><StudioApp /></Suspense> : <App />}
  </StrictMode>,
);
