import { renderHistory } from './history.js';
import { renderCrisisPlan } from './crisis.js';

const views = document.querySelectorAll('.view');
const appTitle = document.getElementById('app-title');
const loggerView = document.getElementById('logger-view');

/**
 * Switches the active view and updates the header title.
 * Also triggers rendering functions for History/Crisis views.
 */

export function switchView(targetView, title) {
  views.forEach((v) => v.classList.remove('active'));
  targetView.classList.add('active');
  appTitle.textContent = title;

  const body = document.body;
  if (targetView.id === 'logger-view') {
    body.className = 'mood-default';
  }
  if (targetView.id === 'history-view') {
    renderHistory();
  } else if (targetView.id === 'crisis-view') {
    renderCrisisPlan();
  }
}

// Helper to switch back to the main logger view
export function resetToLoggerView() {
  switchView(loggerView, 'Log Your Moment');
}
