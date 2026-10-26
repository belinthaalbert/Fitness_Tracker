document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page !== 'profile') return;

  const { helpers } = window.FitTrackApp;
  const form = document.getElementById('profileForm');
  const messageNode = document.getElementById('profileMessage');

  function setFormValues(profile) {
    document.getElementById('profileName').value = profile.name || '';
    document.getElementById('profileEmail').value = profile.email || '';
    document.getElementById('profileAge').value = profile.age || '';
    document.getElementById('profileHeight').value = profile.height || '';
    document.getElementById('profileWeight').value = profile.weight || '';
    document.getElementById('profileGender').value = profile.gender || 'Female';
    document.getElementById('profileActivityLevel').value = profile.activityLevel || 'Moderate';
    document.getElementById('profileGoal').value = profile.fitnessGoal || 'Fat loss';

    document.getElementById('profileNameDisplay').textContent = profile.name || 'Ava Brooks';
    document.getElementById('profileEmailDisplay').textContent = profile.email || 'ava@example.com';
    document.getElementById('profileGoalBadge').textContent = profile.fitnessGoal || 'Fat loss';
    document.getElementById('profileActivityBadge').textContent = profile.activityLevel || 'Moderate';
    document.getElementById('profileAvatar').textContent = helpers.getInitials(profile.name);
  }

  function updateMetricSummary() {
    const profile = helpers.getProfile();
    const height = Number(profile.height || 0);
    const weight = Number(profile.weight || 0);
    const bmi = height > 0 && weight > 0 ? weight / ((height / 100) ** 2) : 0;
    const calories = Math.round((10 * weight) + (6.25 * height) - (5 * Number(profile.age || 30)) + 5);

    document.getElementById('bmiValue').textContent = bmi ? bmi.toFixed(1) : '0.0';
    document.getElementById('calorieNeedValue').textContent = `${calories} kcal`;
    document.getElementById('goalSummaryValue').textContent = profile.fitnessGoal || 'Fat loss';
  }

  const profile = helpers.getProfile();
  setFormValues(profile);
  updateMetricSummary();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const updated = {
      name: document.getElementById('profileName').value.trim(),
      email: document.getElementById('profileEmail').value.trim(),
      age: Number(document.getElementById('profileAge').value),
      height: Number(document.getElementById('profileHeight').value),
      weight: Number(document.getElementById('profileWeight').value),
      gender: document.getElementById('profileGender').value,
      activityLevel: document.getElementById('profileActivityLevel').value,
      fitnessGoal: document.getElementById('profileGoal').value,
    };

    if (!updated.name || !updated.email || !updated.age || !updated.height || !updated.weight) {
      helpers.showMessage(messageNode, 'Please complete all required profile fields.', 'error');
      return;
    }

    helpers.saveProfile(updated);
    setFormValues(updated);
    updateMetricSummary();
    helpers.showMessage(messageNode, 'Profile saved successfully.', 'success');
  });
});
