// app.js (The Main Entry Point)

import { switchView } from './navigation.js';
import { initLogger } from './logger.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Get DOM references for navigation targets
  const loggerView = document.getElementById('logger-view');
  const historyView = document.getElementById('history-view');
  const crisisView = document.getElementById('crisis-view');
  const appTitle = document.getElementById('app-title');

  // 2. Initialize the Logger Module (sets up click listeners and initial state)
  initLogger();

  // --- PWA: Register Service Worker ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((registration) => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope,
          );
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  }

  // 3. Setup Global Navigation

  document.getElementById('view-crisis-btn').addEventListener('click', () => {
    switchView(crisisView, 'Crisis & Coping Plan');
  });

  document.getElementById('view-history-btn').addEventListener('click', () => {
    switchView(historyView, 'Mood History & Trends');
  });

  appTitle.addEventListener('click', () => {
    switchView(loggerView, 'Log Your Moment');
  });

  // 4. Initial Load: Start on the logger view
  switchView(loggerView, 'Log Your Moment');
});
