// crisis.js
import { loadCrisisPlan, saveCrisisPlan, emergencyContacts } from './data.js';

export function renderCrisisPlan() {
  const contactsContainer = document.getElementById('emergency-contacts');
  const planTextarea = document.getElementById('crisis-plan-text');
  const saveStatus = document.getElementById('save-status');

  contactsContainer.innerHTML = '';

  emergencyContacts.forEach((contact) => {
    const row = document.createElement('div');
    row.classList.add('contact-row');
    row.innerHTML = `
            <span class="contact-name">${contact.name}</span>
            <a href="tel:${contact.phone}" class="contact-phone-btn">Call Now</a>
        `;
    contactsContainer.appendChild(row);
  });

  planTextarea.value = loadCrisisPlan();

  // Autosave functionality
  let saveTimer;
  planTextarea.addEventListener('input', () => {
    saveStatus.textContent = 'Saving...';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveCrisisPlan(planTextarea.value);
      saveStatus.textContent = 'Plan saved automatically!';
    }, 1500);
  });
  saveStatus.textContent = 'Plan loaded. Changes save automatically.';
}
