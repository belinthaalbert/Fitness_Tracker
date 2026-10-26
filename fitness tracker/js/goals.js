document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page !== 'goals') return;

  const { helpers } = window.FitTrackApp;
  const form = document.getElementById('goalForm');
  const list = document.getElementById('goalList');
  const messageNode = document.getElementById('goalMessage');

  function getGoals() {
    return helpers.getStoredData('fittrack_goals', window.FitTrackApp.DEFAULT_GOALS);
  }

  function calculateProgress(goal) {
    const target = Number(goal.target || 0);
    const current = Number(goal.current || 0);
    const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;
    return Math.round(progress);
  }

  function renderGoals() {
    const goals = getGoals();

    if (!goals.length) {
      list.innerHTML = '<div class="empty-state"><div><h3>No goals yet</h3><p>Create a new goal to start tracking progress.</p></div></div>';
      return;
    }

    list.innerHTML = goals.map((goal) => {
      const progress = calculateProgress(goal);
      return `
        <article class="goal-item ${goal.completed ? 'completed' : ''}">
          <div class="goal-topline">
            <h3>${goal.title}</h3>
            <span class="goal-category">${goal.category}</span>
          </div>
          <div class="progress-meta">
            <span>${goal.current} / ${goal.target}</span>
            <strong>${progress}%</strong>
          </div>
          <div class="progress-bar"><span style="width:${progress}%"></span></div>
          <div class="goal-actions">
            <button class="btn btn-primary" type="button" data-complete-goal="${goal.id}">${goal.completed ? 'Completed' : 'Mark done'}</button>
            <button class="btn btn-secondary" type="button" data-edit-goal="${goal.id}">Edit</button>
            <button class="btn btn-ghost danger-btn" type="button" data-delete-goal="${goal.id}">Delete</button>
          </div>
        </article>
      `;
    }).join('');

    document.querySelectorAll('[data-complete-goal]').forEach((button) => {
      button.addEventListener('click', () => {
        const goals = getGoals();
        const selected = goals.find((goal) => goal.id === button.dataset.completeGoal);
        if (!selected) return;
        selected.completed = !selected.completed;
        selected.current = selected.completed ? selected.target : Math.min(selected.current, selected.target);
        helpers.setStoredData('fittrack_goals', goals);
        renderGoals();
      });
    });

    document.querySelectorAll('[data-delete-goal]').forEach((button) => {
      button.addEventListener('click', () => {
        const goals = getGoals().filter((goal) => goal.id !== button.dataset.deleteGoal);
        helpers.setStoredData('fittrack_goals', goals);
        renderGoals();
      });
    });

    document.querySelectorAll('[data-edit-goal]').forEach((button) => {
      button.addEventListener('click', () => {
        const goals = getGoals();
        const selected = goals.find((goal) => goal.id === button.dataset.editGoal);
        if (!selected) return;
        document.getElementById('goalTitle').value = selected.title;
        document.getElementById('goalCategory').value = selected.category;
        document.getElementById('goalDeadline').value = selected.deadline;
        document.getElementById('goalTarget').value = selected.target;
        document.getElementById('goalCurrent').value = selected.current;
        form.dataset.editId = selected.id;
      });
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('goalTitle').value.trim();
    const category = document.getElementById('goalCategory').value;
    const target = Number(document.getElementById('goalTarget').value);
    const current = Number(document.getElementById('goalCurrent').value);
    const deadline = document.getElementById('goalDeadline').value;

    if (!title || !target || !deadline) {
      helpers.showMessage(messageNode, 'Please add a goal title, target value, and deadline.', 'error');
      return;
    }

    const goals = getGoals();
    const editId = form.dataset.editId;

    if (editId) {
      const item = goals.find((goal) => goal.id === editId);
      if (item) {
        item.title = title;
        item.category = category;
        item.target = target;
        item.current = current;
        item.deadline = deadline;
      }
      delete form.dataset.editId;
    } else {
      goals.push({
        id: `goal-${Date.now()}`,
        title,
        category,
        target,
        current,
        deadline,
        completed: false,
      });
    }

    helpers.setStoredData('fittrack_goals', goals);
    form.reset();
    helpers.showMessage(messageNode, editId ? 'Goal updated successfully.' : 'Goal created successfully.', 'success');
    renderGoals();
  });

  renderGoals();
});
