document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page !== 'dashboard') return;

  const { helpers } = window.FitTrackApp;
  const profile = helpers.getProfile();
  const progress = helpers.getStoredData('fittrack_progress', []);
  const nutrition = helpers.getStoredData('fittrack_nutrition', { breakfast: [], lunch: [], dinner: [], snacks: [] });
 
  const totalCalories = Object.values(nutrition).reduce((sum, meal) => {
    return sum + meal.reduce((mealSum, item) => mealSum + Number(item.calories || 0) * Number(item.quantity || 1), 0);
  }, 0);

  const latestProgress = progress[progress.length - 1] || { steps: 8740, calories: 640, sleep: 7.4, water: 2.1, heartRate: 120 };
  const stepGoal = 10000;
  const stepPercent = Math.min(100, Math.round((latestProgress.steps / stepGoal) * 100));

  const calorieGoal = 2200;
  const remainingCalories = Math.max(0, calorieGoal - totalCalories);

  document.getElementById('calorieGoalValue').textContent = `${calorieGoal} kcal`;
  document.getElementById('calorieGoalRemaining').textContent = `${remainingCalories.toLocaleString()} kcal`;
  document.getElementById('stepsValue').textContent = latestProgress.steps.toLocaleString();
  document.getElementById('stepGoalProgress').textContent = `${stepPercent}%`;
  document.getElementById('caloriesBurnedValue').textContent = `${latestProgress.calories} kcal`;
  document.getElementById('activeMinutesValue').textContent = `${Math.max(30, Math.round(latestProgress.calories / 15))} min`;
  document.getElementById('waterValue').textContent = `${Number(latestProgress.water || 2.1).toFixed(1)} L`;
  document.getElementById('waterGoalProgress').textContent = `${Math.min(100, Math.round(((latestProgress.water || 2.1) / 3) * 100))}%`;
  document.getElementById('sleepValue').textContent = `${Number(latestProgress.sleep || 7.4).toFixed(1)} hrs`;
  document.getElementById('sleepScoreValue').textContent = '92';
  document.getElementById('heartRateValue').textContent = `${latestProgress.heartRate || 120} bpm`;
  document.getElementById('restingHeartRateValue').textContent = '68 bpm';

  const weeklyGoal = 78;
  document.getElementById('weeklyGoalPercent').textContent = `${weeklyGoal}%`;
  document.getElementById('weeklyGoalBar').style.width = `${weeklyGoal}%`;

  const motivationMessages = [
    '“Consistency compounds. One smart workout today builds momentum for tomorrow.”',
    '“Every rep counts. Keep showing up for your future self.”',
    '“Strong habits create strong results. Your progress is stacking.”',
    '“You do not need a perfect day. You need a focused one.”',
  ];
  document.getElementById('motivationMessage').textContent = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];

  const demoWorkout = helpers.getStoredData('fittrack_workouts', window.FitTrackApp.DEFAULT_WORKOUTS)[0];
  document.getElementById('todayWorkoutName').textContent = demoWorkout.name;

  const mealList = document.getElementById('todayMealList');
  if (mealList) {
    const todaysMeals = [
      { label: 'Breakfast', value: `${nutrition.breakfast.reduce((sum, item) => sum + Number(item.calories || 0) * Number(item.quantity || 1), 0)} kcal` },
      { label: 'Lunch', value: `${nutrition.lunch.reduce((sum, item) => sum + Number(item.calories || 0) * Number(item.quantity || 1), 0)} kcal` },
      { label: 'Dinner', value: `${nutrition.dinner.reduce((sum, item) => sum + Number(item.calories || 0) * Number(item.quantity || 1), 0)} kcal` },
    ];
    mealList.innerHTML = todaysMeals.map((meal) => `<li><span>${meal.label}</span><strong>${meal.value}</strong></li>`).join('');
  }

  const chartCanvas = document.getElementById('weeklyChart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    const data = [6200, 7600, 8100, 7000, 9150, 9800, 10350];
    const width = chartCanvas.width = chartCanvas.clientWidth * window.devicePixelRatio;
    const height = chartCanvas.height = 220 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const chartWidth = chartCanvas.clientWidth;
    const chartHeight = 220;
    const padding = 28;
    const maxValue = Math.max(...data) + 1000;

    ctx.clearRect(0, 0, chartWidth, chartHeight);
    ctx.strokeStyle = '#dfe9ee';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding + (i * (chartHeight - padding * 2)) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(chartWidth - padding, y);
      ctx.stroke();
    }

    const points = data.map((value, index) => {
      const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1);
      const y = chartHeight - padding - ((value / maxValue) * (chartHeight - padding * 2));
      return { x, y };
    });

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = '#2bb673';
    ctx.lineWidth = 3;
    ctx.stroke();

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2bb673';
      ctx.fill();
    });
  }

  document.getElementById('startWorkoutBtn').addEventListener('click', () => {
    window.location.href = `workout-details.html?id=${demoWorkout.id}`;
  });

  document.querySelectorAll('[data-quick-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.quickAction;
      if (action === 'workout') {
        window.location.href = 'workouts.html';
      }
      if (action === 'meal') {
        window.location.href = 'nutrition.html';
      }
      if (action === 'water') {
        window.location.href = 'nutrition.html';
      }
      if (action === 'weight') {
        window.location.href = 'progress.html';
      }
    });
  });

  const nameNode = document.getElementById('topbarName');
  if (nameNode) {
    nameNode.textContent = profile.name || 'Ava Brooks';
  }
});
