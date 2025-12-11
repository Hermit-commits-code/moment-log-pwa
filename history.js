// history.js (Simplified & Modular)
import { loadLogs, deleteLog } from './data.js';
import { renderMoodChart } from './chart.js';
import { startEditLog } from './logger.js';
import { exportLogsToPDF } from './export.js';

// --- HISTORY RENDERING ---
export function renderHistory() {
  const logs = loadLogs();
  const logList = document.getElementById('log-list');

  logList.innerHTML = '';

  if (logs.length === 0) {
    logList.innerHTML =
      '<p style="text-align: center; margin-top: 20px;">No logs yet. Go log a moment!</p>';
    renderMoodChart([]); // Pass empty array to clear chart
    return;
  }
  // --- Wire up PDF Export Button ---
  const exportBtn = document.getElementById('export-pdf-btn');
  if (exportBtn) {
    // Remove existing listener to prevent duplicates before adding the new one
    exportBtn.removeEventListener('click', exportLogsToPDF);
    exportBtn.addEventListener('click', exportLogsToPDF);
  }

  logs.slice(0, 25).forEach((log) => {
    const date = new Date(log.timestamp).toLocaleString();
    const listItem = document.createElement('li');

    listItem.classList.add('log-entry');
    listItem.dataset.id = log.id;
    listItem.dataset.state = log.moodState;

    listItem.innerHTML = `
            <div class="log-header">
                <span class="log-state">${log.moodState}</span>
                <span class="log-time">${date}</span>
                <button class="edit-log-btn">✏️</button>
                <button class="delete-log-btn">🗑️</button>
            </div>
            <p class="log-tags">${log.tags.join(', ')}</p>
            <p class="log-notes">${log.notes || 'No notes.'}</p>
            <p class="log-context">
                Duration: ${log.moodDuration || 'N/A'} | Sleep: ${
      log.sleepHours || 'N/A'
    }h | Caffeine: ${log.caffeineUnits || 'N/A'}
            </p>
        `;

    listItem.querySelector('.delete-log-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this log?')) {
        deleteLog(log.id);
        renderHistory();
      }
    });

    logList.appendChild(listItem);

    listItem.querySelector('.edit-log-btn').addEventListener('click', () => {
      startEditLog(log); // Pass the entire log object
    });

    logList.appendChild(listItem);
  });

  renderMoodChart(logs); // Call the chart module function
}
