document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page !== 'nutrition') return;

  const { helpers } = window.FitTrackApp;
  const nutritionForm = document.getElementById('nutritionForm');
  const mealSections = document.getElementById('mealSections');
  const nutritionMessage = document.getElementById('nutritionMessage');

  function getNutritionData() {
    return helpers.getStoredData('fittrack_nutrition', window.FitTrackApp.DEFAULT_NUTRITION);
  }

  function updateTotals() {
    const todayNutrition = getNutritionData();
    const allMeals = Object.values(todayNutrition).flat();
    const totalCalories = allMeals.reduce((sum, item) => sum + Number(item.calories || 0) * Number(item.quantity || 1), 0);
    const protein = allMeals.reduce((sum, item) => sum + Number(item.protein || 0) * Number(item.quantity || 1), 0);
    const carbs = allMeals.reduce((sum, item) => sum + Number(item.carbs || 0) * Number(item.quantity || 1), 0);
    const fat = allMeals.reduce((sum, item) => sum + Number(item.fat || 0) * Number(item.quantity || 1), 0);
    const goal = 2200;
    const remaining = goal - totalCalories;

    document.getElementById('targetCalories').textContent = `${goal} kcal`;
    document.getElementById('consumedCalories').textContent = `${totalCalories} kcal`;
    document.getElementById('remainingCalories').textContent = `${remaining} kcal`;
    document.getElementById('proteinValue').textContent = `${protein}g / 160g`;
    document.getElementById('carbsValue').textContent = `${carbs}g / 230g`;
    document.getElementById('fatValue').textContent = `${fat}g / 70g`;

    document.getElementById('proteinBar').style.width = `${Math.min(100, (protein / 160) * 100)}%`;
    document.getElementById('carbsBar').style.width = `${Math.min(100, (carbs / 230) * 100)}%`;
    document.getElementById('fatBar').style.width = `${Math.min(100, (fat / 70) * 100)}%`;
  }

  function renderMealSections() {
    const meals = getNutritionData();
    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snacks'];

    mealSections.innerHTML = mealOrder.map((mealKey) => {
      const items = meals[mealKey] || [];
      const total = items.reduce((sum, item) => sum + Number(item.calories || 0) * Number(item.quantity || 1), 0);

      return `
        <article class="meal-section">
          <div class="meal-section-header">
            <h3>${mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}</h3>
            <strong>${total} kcal</strong>
          </div>
          ${items.length ? `
            <ul class="meal-items">
              ${items.map((item) => `
                <li class="meal-item">
                  <div>
                    <strong>${item.name}</strong>
                    <div class="chip-row">
                      <span>${item.quantity} serving</span>
                    </div>
                  </div>
                  <div class="item-actions">
                    <span>${Number(item.calories || 0) * Number(item.quantity || 1)} kcal</span>
                    <button class="icon-button" type="button" data-delete-item="${mealKey}" data-item-id="${item.id}">×</button>
                  </div>
                </li>
              `).join('')}
            </ul>
          ` : '<div class="empty-state"><div><p>No foods logged yet.</p></div></div>'}
        </article>
      `;
    }).join('');

    document.querySelectorAll('[data-delete-item]').forEach((button) => {
      button.addEventListener('click', () => {
        const mealKey = button.dataset.deleteItem;
        const itemId = Number(button.dataset.itemId);
        const data = getNutritionData();
        data[mealKey] = (data[mealKey] || []).filter((item) => item.id !== itemId);
        helpers.setStoredData('fittrack_nutrition', data);
        renderMealSections();
        updateTotals();
      });
    });
  }

  nutritionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('foodName').value.trim();
    const calories = Number(document.getElementById('foodCalories').value);
    const protein = Number(document.getElementById('foodProtein').value);
    const carbs = Number(document.getElementById('foodCarbs').value);
    const fat = Number(document.getElementById('foodFat').value);
    const quantity = Number(document.getElementById('foodQuantity').value);
    const meal = document.getElementById('foodMeal').value;

    if (!name || !calories || !quantity) {
      helpers.showMessage(nutritionMessage, 'Please fill in the food name, calories, and quantity.', 'error');
      return;
    }

    const entry = {
      id: Date.now(),
      name,
      calories,
      protein,
      carbs,
      fat,
      quantity,
      meal,
    };

    const data = getNutritionData();
    data[meal].push(entry);
    helpers.setStoredData('fittrack_nutrition', data);
    nutritionForm.reset();
    helpers.showMessage(nutritionMessage, 'Meal added successfully.', 'success');
    renderMealSections();
    updateTotals();
  });

  renderMealSections();
  updateTotals();
});
