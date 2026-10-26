document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page !== 'progress') return;

  const { helpers } = window.FitTrackApp;
  const form = document.getElementById('progressForm');
  const messageNode = document.getElementById('progressMessage');

  function readProgress() {
    return helpers.getStoredData('fittrack_progress', window.FitTrackApp.DEFAULT_PROGRESS);
  }

  function renderCharts() {
    const entries = readProgress();
    if (!entries.length) return;

    const weightCtx = document.getElementById('weightChart')?.getContext('2d');
    const activityCtx = document.getElementById('activityChart')?.getContext('2d');
    if (!weightCtx || !activityCtx) return;

    const weights = entries.map((entry) => Number(entry.weight));
    const steps = entries.map((entry) => Number(entry.steps));
    const calories = entries.map((entry) => Number(entry.calories));
    const labels = entries.map((entry) => new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

    function drawLineChart(context, series, color, maxValue) {
      const width = context.canvas.clientWidth;
      const height = context.canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      if (!series.length) return;

      const padding = 30;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const max = maxValue || Math.max(...series) + 200;

      context.strokeStyle = '#dfe9ee';
      context.lineWidth = 1;
      for (let i = 0; i <= 4; i += 1) {
        const y = padding + (i * chartHeight) / 4;
        context.beginPath();
        context.moveTo(padding, y);
        context.lineTo(width - padding, y);
        context.stroke();
      }

      const points = series.map((value, index) => {
        const x = padding + (index * chartWidth) / Math.max(series.length - 1, 1);
        const y = height - padding - (value / max) * chartHeight;
        return { x, y };
      });

      context.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      });
      context.strokeStyle = color;
      context.lineWidth = 3;
      context.stroke();

      points.forEach((point) => {
        context.beginPath();
        context.arc(point.x, point.y, 4, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
      });
    }

    drawLineChart(weightCtx, weights, '#2bb673', Math.max(...weights) + 2);

    const barData = steps.map((value, index) => ({
      value,
      x: index,
    }));
    const barWidth = activityCtx.canvas.clientWidth;
    const barHeight = activityCtx.canvas.clientHeight;
    activityCtx.clearRect(0, 0, barWidth, barHeight);

    const padding = 30;
    const chartWidth = barWidth - padding * 2;
    const chartHeight = barHeight - padding * 2;
    const maxBar = Math.max(...steps, ...calories) + 200;
    const stepBarWidth = chartWidth / Math.max(barData.length, 1) * 0.58;

    activityCtx.strokeStyle = '#dfe9ee';
    for (let i = 0; i <= 4; i += 1) {
      const y = padding + (i * chartHeight) / 4;
      activityCtx.beginPath();
      activityCtx.moveTo(padding, y);
      activityCtx.lineTo(barWidth - padding, y);
      activityCtx.stroke();
    }

    steps.forEach((value, index) => {
      const x = padding + (index * chartWidth) / Math.max(steps.length, 1) + 12;
      const barHeightValue = (value / maxBar) * chartHeight;
      activityCtx.fillStyle = '#2bb673';
      activityCtx.fillRect(x, barHeight - padding - barHeightValue, stepBarWidth, barHeightValue);
    });

    calories.forEach((value, index) => {
      const x = padding + (index * chartWidth) / Math.max(calories.length, 1) + 12 + stepBarWidth + 8;
      const barHeightValue = (value / maxBar) * chartHeight;
      activityCtx.fillStyle = '#f5a623';
      activityCtx.fillRect(x, barHeight - padding - barHeightValue, stepBarWidth, barHeightValue);
    });

    const latestWeight = weights[weights.length - 1] || 0;
    const previousWeight = weights[weights.length - 2] || latestWeight;
    document.getElementById('currentWeightStat').textContent = `${latestWeight.toFixed(1)} kg`;
    document.getElementById('weightTrendText').textContent = latestWeight < previousWeight ? 'Trend: trending down' : latestWeight === previousWeight ? 'Trend: stable' : 'Trend: up';
    document.getElementById('workoutFrequencyStat').textContent = `${entries.length} / week`;
    document.getElementById('avgStepsStat').textContent = Math.round(steps.reduce((sum, value) => sum + value, 0) / steps.length).toLocaleString();
  }

  function refreshProgressData() {
    renderCharts();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const weight = Number(document.getElementById('entryWeight').value);
    const steps = Number(document.getElementById('entrySteps').value);
    const calories = Number(document.getElementById('entryCalories').value);
    const date = document.getElementById('entryDate').value;
    const notes = document.getElementById('entryNotes').value.trim();

    if (!weight || !steps || !calories || !date) {
      helpers.showMessage(messageNode, 'Please fill in all required progress fields.', 'error');
      return;
    }

    const entry = { date, weight, steps, calories, notes };
    const entries = readProgress();
    entries.push(entry);
    helpers.setStoredData('fittrack_progress', entries);
    form.reset();
    helpers.showMessage(messageNode, 'Progress updated successfully.', 'success');
    refreshProgressData();
  });

  refreshProgressData();
});
