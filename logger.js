// logger.js
import { createLog, ALL_TAGS, updateLog, loadLogs } from './data.js';
import { resetToLoggerView } from './navigation.js';
import { renderHistory } from './history.js'; // Needed to re-render history after update

// DOM Elements local to the logger view (Ensure all inputs are captured)
const body = document.body;
const moodZones = document.querySelectorAll('.mood-zone');
const detailsForm = document.getElementById('details-form');
const tagsContainer = document.getElementById('tags-container');

// Input element references
const notesInput = document.getElementById('notes');
const sleepHoursInput = document.getElementById('sleep-hours');
const caffeineUnitsInput = document.getElementById('caffeine-units');
const durationInput = document.getElementById('mood-duration');
const editingLogIdInput = document.getElementById('editing-log-id'); // NEW ID

// State local to the logger view
let currentMoodState = null;

// --- TAGS HELPER FUNCTIONS (Retained from previous fix) ---

function updateSelectedTags() {
  const selectedTagsInput = tagsContainer.querySelector('#selected-tags');

  if (!selectedTagsInput) {
    console.error(
      "CRITICAL ERROR: Hidden input 'selected-tags' not found in container.",
    );
    return;
  }

  const selected = Array.from(
    tagsContainer.querySelectorAll('.tag-btn.selected'),
  ).map((btn) => btn.dataset.tag);

  selectedTagsInput.value = selected.join(',');
}

function renderTags(mood) {
  // FIX: Only clear dynamically added buttons, preserve the hidden input field
  while (tagsContainer.children.length > 1) {
    tagsContainer.removeChild(tagsContainer.lastChild);
  }

  const tags = ALL_TAGS[mood] || [];

  tags.forEach((tag) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('tag-btn');
    btn.textContent = tag;
    btn.dataset.tag = tag;

    btn.addEventListener('click', (e) => {
      e.target.classList.toggle('selected');
      updateSelectedTags();
    });

    tagsContainer.appendChild(btn);
  });

  updateSelectedTags();
}

// --- MOOD SLIDER LOGIC ---

export function selectMood(mood, zoneElement) {
  if (mood === currentMoodState) return;

  currentMoodState = mood;
  body.className = `mood-${mood.toLowerCase()}`;
  detailsForm.classList.remove('collapsed');

  moodZones.forEach((zone) => zone.classList.remove('selected-zone'));
  if (zoneElement) {
    zoneElement.classList.add('selected-zone');
  }
  renderTags(mood);
}

// --- START EDIT FUNCTION (CRUD 'U') ---

export function startEditLog(log) {
  // 1. Switch back to the Logger View
  resetToLoggerView();

  // 2. Set the ID of the log being edited
  editingLogIdInput.value = log.id;

  // 3. Populate Form Fields
  const zoneElement = document.querySelector(
    `.mood-zone.${log.moodState.toLowerCase()}`,
  );
  selectMood(log.moodState, zoneElement);

  notesInput.value = log.notes;
  sleepHoursInput.value = log.sleepHours || '';
  caffeineUnitsInput.value = log.caffeineUnits || '';
  durationInput.value = log.moodDuration || '';

  // 4. Select the Tags
  const tagsToSelect = new Set(log.tags);
  tagsContainer.querySelectorAll('.tag-btn').forEach((btn) => {
    if (tagsToSelect.has(btn.dataset.tag)) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  updateSelectedTags(); // Recalculate the hidden input value

  // 5. Update the form button text (UX improvement)
  document.getElementById('save-log-btn').textContent = 'SAVE CHANGES';
}

// --- FORM SUBMISSION (Refactored to handle CREATE and UPDATE) ---

detailsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentMoodState) {
    alert('Please select a mood state first!');
    return;
  }

  const isEditing = editingLogIdInput.value !== '';
  const logId = editingLogIdInput.value;
  const allLogs = isEditing ? loadLogs() : [];

  // Gather data (same structure for both create and update)
  const logData = {
    moodState: currentMoodState,
    notes: notesInput.value.trim(),
    tags: document
      .getElementById('selected-tags')
      .value.split(',')
      .filter((t) => t.length > 0),
    sleepHours: sleepHoursInput.value,
    caffeineUnits: caffeineUnitsInput.value,
    moodDuration: durationInput.value,

    // Preserve original timestamp/ID for updates, create new for new logs
    timestamp: isEditing
      ? allLogs.find((l) => l.id === logId)?.timestamp || Date.now()
      : Date.now(),
    id: isEditing ? logId : Date.now().toString(), // Use existing ID for update, new timestamp for create
  };

  if (isEditing) {
    // UPDATE LOG
    updateLog(logData);
    alert(`Log ID ${logId} updated!`);
  } else {
    // CREATE NEW LOG
    createLog(logData);
    alert(`New log saved for ${currentMoodState}!`);
  }

  // --- Reset UI ---
  detailsForm.reset();
  detailsForm.classList.add('collapsed');
  currentMoodState = null;
  body.className = 'mood-default';
  editingLogIdInput.value = ''; // Clear the editing ID
  document.getElementById('save-log-btn').textContent = 'SAVE LOG'; // Reset button text

  // Re-initialize to MIXED state and return to logger view
  const mixedZone = document.querySelector('.mood-zone.mixed');
  if (mixedZone) {
    selectMood('MIXED', mixedZone);
  }

  // Re-render history if we came from there (important for UX)
  renderHistory();
  resetToLoggerView();
});

// --- Initialization ---

export function initLogger() {
  // Set up click listeners for the mood zones
  moodZones.forEach((zone) => {
    zone.addEventListener('click', () => {
      selectMood(zone.dataset.mood, zone);
    });
  });

  // Initial load: Select MIXED state
  const mixedZone = document.querySelector('.mood-zone.mixed');
  if (mixedZone) {
    selectMood('MIXED', mixedZone);
  }
}
