import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import './main.scss';
import './fonts/AunchantedXspace.ttf';
import './fonts/AunchantedXspaceBold.ttf';
import './fonts/AunchantedXspaceThin.ttf';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
