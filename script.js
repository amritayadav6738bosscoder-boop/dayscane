const storageKey = 'daywell-entries';

const form = document.getElementById('entryForm');
const entryList = document.getElementById('entryList');
const resetBtn = document.getElementById('resetBtn');
const entryDate = document.getElementById('entryDate');
const moodSelect = document.getElementById('moodSelect');

const defaultEntries = [
  {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    mood: 'happy',
    wins: 'Started a small win and kept my focus on what matters.',
    challenges: 'A little overwhelmed, but I paused and reset.',
    gratitude: 'Grateful for a calm morning and a supportive community.'
  }
];

const loadEntries = () => {
  const storedEntries = JSON.parse(localStorage.getItem(storageKey) || 'null');
  return storedEntries && storedEntries.length ? storedEntries : defaultEntries;
};

const saveEntries = (entries) => {
  localStorage.setItem(storageKey, JSON.stringify(entries));
};

const renderMoodPill = (mood) => {
  const label = mood || 'happy';
  return `<span class="mood-pill mood-${label}">${label}</span>`;
};

const renderEntries = () => {
  const entries = loadEntries();

  if (!entries.length) {
    entryList.innerHTML = '<li class="empty-state">No reflections yet. Save your first entry to begin.</li>';
    return;
  }

  const orderedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  entryList.innerHTML = orderedEntries
    .map(
      (entry) => `
        <li class="entry-item">
          <div class="entry-header">
            <span class="entry-date">${new Date(entry.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            ${renderMoodPill(entry.mood)}
          </div>
          <div class="entry-meta">
            <div><strong>Wins</strong><div>${entry.wins || '—'}</div></div>
            <div><strong>Challenges</strong><div>${entry.challenges || '—'}</div></div>
            <div><strong>Gratitude</strong><div>${entry.gratitude || '—'}</div></div>
          </div>
        </li>
      `
    )
    .join('');
};

const hydrateForm = () => {
  entryDate.value = new Date().toISOString().split('T')[0];
  moodSelect.value = 'happy';
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const entries = loadEntries();
  const newEntry = {
    id: crypto.randomUUID(),
    date: entryDate.value,
    mood: moodSelect.value,
    wins: document.getElementById('winsInput').value.trim(),
    challenges: document.getElementById('challengesInput').value.trim(),
    gratitude: document.getElementById('gratitudeInput').value.trim()
  };

  const updatedEntries = [newEntry, ...entries];
  saveEntries(updatedEntries);
  renderEntries();
  form.reset();
  hydrateForm();
});

resetBtn.addEventListener('click', () => {
  localStorage.removeItem(storageKey);
  renderEntries();
  form.reset();
  hydrateForm();
});

hydrateForm();
renderEntries();
