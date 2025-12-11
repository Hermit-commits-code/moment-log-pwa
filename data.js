// data.js (The Hive Replacement and Data Source)

export const STORAGE_KEY = 'moment_logs_pwa';
export const CRISIS_KEY = 'crisis_plan_pwa';

// --- Mood Log Data ---

/** Loads all logs from localStorage. */
export function loadLogs() {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

/** Saves the list of logs back to localStorage. */
export function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

/** Creates and saves a new log. */
export function createLog(logData) {
  const logs = loadLogs();

  // Create the new log object based on the Flutter model
  const newLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    moodState: logData.moodState,
    notes: logData.notes,
    tags: logData.tags,
    sleepHours: logData.sleepHours ? parseFloat(logData.sleepHours) : null,
    caffeineUnits: logData.caffeineUnits
      ? parseInt(logData.caffeineUnits)
      : null,
  };

  logs.unshift(newLog);
  saveLogs(logs);
  return newLog;
}

/** Deletes a log by its ID. */
export function deleteLog(id) {
  let logs = loadLogs();
  const initialLength = logs.length;
  logs = logs.filter((log) => log.id !== id);
  if (logs.length < initialLength) {
    saveLogs(logs);
    return true;
  }
  return false;
}

/** Updates a log */
export function updateLog(updatedLog) {
  let logs = loadLogs();
  const index = logs.findIndex((log) => log.id === updatedLog.id);

  if (index !== -1) {
    // Replace the old log object with the new one
    logs[index] = updatedLog;
    saveLogs(logs);
  } else {
    console.error(
      'Attempted to update a log that does not exist:',
      updatedLog.id,
    );
  }
}

// --- Crisis Plan Data ---

export function loadCrisisPlan() {
  return localStorage.getItem(CRISIS_KEY) || '';
}

export function saveCrisisPlan(text) {
  localStorage.setItem(CRISIS_KEY, text);
}

// --- Tags from main.dart ---
export const ALL_TAGS = {
  UP: [
    'Irritable',
    'Hyper-focused',
    'Racing Thoughts',
    'Spending',
    'Insomnia',
    'Agitated',
  ],
  MIXED: ['Anxious', 'Rage', 'Agitated', 'Irritable', 'Crying', 'Restless'],
  DOWN: ['Empty', 'Anhedonia', 'Guilt', 'Fatigue', 'Hopeless', 'Withdrawn'],
};

// --- Emergency Contacts from crisis_plan_page.dart ---
// Note: We strip the 'tel:' prefix here since HTML links handle it naturally.
export const emergencyContacts = [
  { name: 'National Suicide Prevention Lifeline', phone: '988' },
  { name: 'Emergency Services', phone: '911' },
  { name: 'Therapist', phone: '2034177886' },
];
