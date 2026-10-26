document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page !== 'settings') return;

  const { helpers } = window.FitTrackApp;
  const settings = helpers.getSettings();
  const form = document.getElementById('settingsForm');
  const messageNode = document.getElementById('settingsMessage');

  document.getElementById('themeToggle').checked = Boolean(settings.darkMode);
  document.getElementById('notificationsToggle').checked = Boolean(settings.notifications !== false);
  document.getElementById('unitSystem').value = settings.unitSystem || 'metric';
  document.getElementById('languageSelect').value = settings.language || 'en';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextSettings = {
      darkMode: document.getElementById('themeToggle').checked,
      notifications: document.getElementById('notificationsToggle').checked,
      unitSystem: document.getElementById('unitSystem').value,
      language: document.getElementById('languageSelect').value,
    };

    helpers.saveSettings(nextSettings);
    helpers.applyTheme();
    helpers.showMessage(messageNode, 'Settings saved successfully.', 'success');
  });

  document.getElementById('clearStorageBtn').addEventListener('click', () => {
    const confirmed = window.confirm('This will clear your local app data. Continue?');
    if (!confirmed) return;

    const keys = Object.values(window.FitTrackApp.STORAGE_KEYS);
    keys.forEach((key) => localStorage.removeItem(key));
    window.location.href = 'index.html';
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    helpers.logoutUser();
  });
});
