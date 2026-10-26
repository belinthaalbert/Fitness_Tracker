document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (!['workouts', 'workouts-detail'].includes(page)) return;

  const { helpers } = window.FitTrackApp;
  const workouts = helpers.getStoredData('fittrack_workouts', window.FitTrackApp.DEFAULT_WORKOUTS);
  const favorites = helpers.getStoredData('fittrack_favorites', []);

  function renderWorkoutLibrary() {
    const grid = document.getElementById('workoutGrid');
    if (!grid) return;

    const searchValue = (document.getElementById('searchWorkout')?.value || '').toLowerCase();
    const muscleValue = document.getElementById('filterMuscle')?.value || 'all';
    const difficultyValue = document.getElementById('filterDifficulty')?.value || 'all';
    const equipmentValue = document.getElementById('filterEquipment')?.value || 'all';
    const typeValue = document.getElementById('filterType')?.value || 'all';
    const categoryValue = document.querySelector('.category-chip.active')?.dataset.category || 'all';

    let filtered = workouts.filter((workout) => {
      const matchesSearch = !searchValue || workout.name.toLowerCase().includes(searchValue) || workout.type.toLowerCase().includes(searchValue);
      const matchesMuscle = muscleValue === 'all' || workout.muscleGroup === muscleValue;
      const matchesDifficulty = difficultyValue === 'all' || workout.difficulty === difficultyValue;
      const matchesEquipment = equipmentValue === 'all' || workout.equipment === equipmentValue;
      const matchesType = typeValue === 'all' || workout.type === typeValue;
      const matchesCategory = categoryValue === 'all' || workout.type === categoryValue || workout.muscleGroup === categoryValue;

      return matchesSearch && matchesMuscle && matchesDifficulty && matchesEquipment && matchesType && matchesCategory;
    });

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state"><div><h3>No workouts found</h3><p>Try changing your filters or search term.</p></div></div>';
      return;
    }

    grid.innerHTML = filtered.map((workout) => {
      const active = favorites.includes(workout.id);
      return `
        <article class="workout-card">
          <button class="fav-btn ${active ? 'active' : ''}" type="button" data-favorite-id="${workout.id}" aria-label="Toggle favorite">
            ${active ? '♥' : '♡'}
          </button>
          <div class="workout-thumb">${workout.icon}</div>
          <div class="workout-card-body">
            <div class="workout-topline">
              <span class="workout-badge">${workout.type}</span>
              <span class="workout-duration">${workout.duration} min</span>
            </div>
            <h3>${workout.name}</h3>
            <div class="workout-badges">
              <span>${workout.difficulty}</span>
              <span>${workout.calories} kcal</span>
              <span>${workout.muscleGroup}</span>
            </div>
            <div class="workout-card-actions">
              <a class="btn btn-secondary" href="workout-details.html?id=${workout.id}">View</a>
              <button class="btn btn-primary" type="button" data-start-workout="${workout.id}">Start</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    document.querySelectorAll('[data-favorite-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.favoriteId;
        const updated = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
        helpers.setStoredData('fittrack_favorites', updated);
        renderWorkoutLibrary();
      });
    });

    document.querySelectorAll('[data-start-workout]').forEach((button) => {
      button.addEventListener('click', () => {
        window.location.href = `workout-details.html?id=${button.dataset.startWorkout}`;
      });
    });
  }

  function renderWorkoutDetail() {
    const heroContainer = document.getElementById('workoutHero');
    const exerciseList = document.getElementById('exerciseList');
    const timerDisplay = document.getElementById('timerDisplay');
    const exerciseProgressText = document.getElementById('exerciseProgressText');
    const exerciseProgressBar = document.getElementById('exerciseProgressBar');

    if (!heroContainer || !exerciseList || !timerDisplay) return;

    const params = new URLSearchParams(window.location.search);
    const workoutId = params.get('id') || workouts[0]?.id;
    const workout = workouts.find((item) => item.id === workoutId) || workouts[0];

    if (!workout) return;

    heroContainer.innerHTML = `
      <div class="workout-hero-inner">
        <div class="workout-hero-art">${workout.icon}</div>
        <div class="workout-hero-content">
          <span class="workout-badge">${workout.type}</span>
          <h2>${workout.name}</h2>
          <p>${workout.description}</p>
          <div class="chip-row">
            <span>${workout.duration} min</span>
            <span>${workout.calories} kcal</span>
            <span>${workout.difficulty}</span>
            <span>${workout.equipment}</span>
          </div>
        </div>
      </div>
    `;

    exerciseList.innerHTML = workout.exercises.map((exercise, index) => `
      <article class="exercise-item" data-exercise-index="${index}">
        <div class="exercise-topline">
          <h3>${index + 1}. ${exercise.name}</h3>
          <button class="btn btn-secondary" type="button" data-mark-complete="${index}">Mark complete</button>
        </div>
        <div class="exercise-meta">
          <span>Sets: ${exercise.sets}</span>
          <span>Reps: ${exercise.reps}</span>
          <span>Rest: ${exercise.rest}</span>
        </div>
        <p>${exercise.instructions}</p>
      </article>
    `).join('');

    const completedIndexes = new Set();
    const totalExercises = workout.exercises.length;

    function updateExerciseProgress() {
      const completedCount = completedIndexes.size;
      const percent = totalExercises ? (completedCount / totalExercises) * 100 : 0;
      exerciseProgressText.textContent = `${completedCount} / ${totalExercises} complete`;
      exerciseProgressBar.style.width = `${percent}%`;
    }

    exerciseList.querySelectorAll('[data-mark-complete]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.markComplete);
        const item = button.closest('.exercise-item');
        if (completedIndexes.has(index)) {
          completedIndexes.delete(index);
          item.classList.remove('completed');
        } else {
          completedIndexes.add(index);
          item.classList.add('completed');
        }
        updateExerciseProgress();
      });
    });

    let timer = 0;
    let timerInterval = null;
    const startTimerBtn = document.getElementById('startTimerBtn');
    const pauseTimerBtn = document.getElementById('pauseTimerBtn');
    const resetTimerBtn = document.getElementById('resetTimerBtn');
    const finishWorkoutBtn = document.getElementById('finishWorkoutBtn');

    function formatTimer(totalSeconds) {
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${minutes}:${seconds}`;
    }

    function updateTimerDisplay() {
      timerDisplay.textContent = formatTimer(timer);
    }

    startTimerBtn.addEventListener('click', () => {
      if (timerInterval) return;
      timerInterval = setInterval(() => {
        timer += 1;
        updateTimerDisplay();
      }, 1000);
    });

    pauseTimerBtn.addEventListener('click', () => {
      if (!timerInterval) return;
      clearInterval(timerInterval);
      timerInterval = null;
    });

    resetTimerBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      timerInterval = null;
      timer = 0;
      updateTimerDisplay();
    });

    finishWorkoutBtn.addEventListener('click', () => {
      const saved = helpers.getStoredData('fittrack_completed_workouts', []);
      saved.push({
        id: workout.id,
        name: workout.name,
        date: new Date().toISOString(),
        calories: workout.calories,
        duration: workout.duration,
      });
      helpers.setStoredData('fittrack_completed_workouts', saved);
      helpers.showMessage(document.getElementById('timerDisplay'), 'Workout saved to your history!', 'success');
      setTimeout(() => {
        window.location.href = 'workouts.html';
      }, 700);
    });

    updateTimerDisplay();
    updateExerciseProgress();
  }

  if (page === 'workouts') {
    const searchInput = document.getElementById('searchWorkout');
    const filterMuscle = document.getElementById('filterMuscle');
    const filterDifficulty = document.getElementById('filterDifficulty');
    const filterEquipment = document.getElementById('filterEquipment');
    const filterType = document.getElementById('filterType');
    const categoryButtons = document.querySelectorAll('.category-chip');

    searchInput?.addEventListener('input', renderWorkoutLibrary);
    filterMuscle?.addEventListener('change', renderWorkoutLibrary);
    filterDifficulty?.addEventListener('change', renderWorkoutLibrary);
    filterEquipment?.addEventListener('change', renderWorkoutLibrary);
    filterType?.addEventListener('change', renderWorkoutLibrary);

    categoryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        categoryButtons.forEach((chip) => chip.classList.remove('active'));
        button.classList.add('active');
        renderWorkoutLibrary();
      });
    });

    renderWorkoutLibrary();
  }

  if (page === 'workouts-detail') {
    renderWorkoutDetail();
  }
});
