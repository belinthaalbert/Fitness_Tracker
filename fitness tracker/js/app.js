(function () {
  const STORAGE_KEYS = {
    login: 'fittrack_login',
    profile: 'fittrack_profile',
    settings: 'fittrack_settings',
    workouts: 'fittrack_workouts',
    favorites: 'fittrack_favorites',
    completedWorkouts: 'fittrack_completed_workouts',
    nutrition: 'fittrack_nutrition',
    progress: 'fittrack_progress',
    goals: 'fittrack_goals',
  };

  const DEFAULT_PROFILE = {
    name: 'Ava Brooks',
    email: 'ava@fittrack.com',
    age: 29,
    height: 168,
    weight: 64,
    gender: 'Female',
    activityLevel: 'Moderate',
    fitnessGoal: 'Fat loss',
  };

  const DEFAULT_SETTINGS = {
    darkMode: false,
    notifications: true,
    unitSystem: 'metric',
    language: 'en',
  };

  const DEFAULT_WORKOUTS = [
    {
      id: 'lower-body-power',
      name: 'Lower Body Power',
      type: 'Strength',
      difficulty: 'Intermediate',
      duration: 45,
      calories: 320,
      equipment: 'Dumbbells',
      muscleGroup: 'Legs',
      focus: 'Legs',
      icon: '🏋️',
      description: 'Build lower-body strength through controlled squats, lunges, and deadlifts.',
      exercises: [
        { name: 'Goblet Squat', sets: 4, reps: '12', rest: '45 sec', instructions: 'Keep chest tall and drive through the heels.' },
        { name: 'Romanian Deadlift', sets: 3, reps: '10', rest: '60 sec', instructions: 'Hinge at the hips and maintain a neutral spine.' },
        { name: 'Walking Lunge', sets: 3, reps: '12 each', rest: '45 sec', instructions: 'Step long and keep balance through the front foot.' },
      ],
    },
    {
      id: 'cardio-burn',
      name: 'Cardio Burn',
      type: 'Cardio',
      difficulty: 'Beginner',
      duration: 30,
      calories: 260,
      equipment: 'Bike',
      muscleGroup: 'Full Body',
      focus: 'Cardio',
      icon: '🚴',
      description: 'Steady-state cardio intervals to improve heart rate and endurance.',
      exercises: [
        { name: 'Warm-up Spin', sets: 1, reps: '5 min', rest: '0 sec', instructions: 'Keep cadence comfortable and controlled.' },
        { name: 'Hill Intervals', sets: 5, reps: '1 min', rest: '45 sec', instructions: 'Increase resistance and push for a strong rhythm.' },
        { name: 'Cool-down Ride', sets: 1, reps: '4 min', rest: '0 sec', instructions: 'Ease the cadence and focus on breathing.' },
      ],
    },
    {
      id: 'hiit-core-blast',
      name: 'HIIT Core Blast',
      type: 'HIIT',
      difficulty: 'Advanced',
      duration: 20,
      calories: 280,
      equipment: 'Mat',
      muscleGroup: 'Core',
      focus: 'Core',
      icon: '🔥',
      description: 'Explosive intervals that hit the abs, obliques, and full-body coordination.',
      exercises: [
        { name: 'Mountain Climbers', sets: 4, reps: '20 sec', rest: '20 sec', instructions: 'Drive the knees in fast while keeping the torso braced.' },
        { name: 'Burpees', sets: 4, reps: '12 sec', rest: '15 sec', instructions: 'Stay explosive and keep a steady landing.' },
        { name: 'Plank Shoulder Taps', sets: 3, reps: '30 sec', rest: '30 sec', instructions: 'Brace the core and move the shoulders without shifting hips.' },
      ],
    },
    {
      id: 'shoulder-shred',
      name: 'Shoulder Shred',
      type: 'Strength',
      difficulty: 'Intermediate',
      duration: 40,
      calories: 310,
      equipment: 'Dumbbells',
      muscleGroup: 'Shoulders',
      focus: 'Shoulders',
      icon: '💪',
      description: 'Target the shoulders with pressing patterns and controlled isolation work.',
      exercises: [
        { name: 'Seated Dumbbell Press', sets: 4, reps: '10', rest: '60 sec', instructions: 'Press vertically and keep ribs down.' },
        { name: 'Lateral Raise', sets: 3, reps: '15', rest: '45 sec', instructions: 'Raise with control and avoid swinging.' },
        { name: 'Front Raise', sets: 3, reps: '12', rest: '45 sec', instructions: 'Lift only to shoulder height with a long range.' },
      ],
    },
    {
      id: 'mobility-flow',
      name: 'Mobility Flow',
      type: 'Yoga',
      difficulty: 'Beginner',
      duration: 25,
      calories: 140,
      equipment: 'Mat',
      muscleGroup: 'Full Body',
      focus: 'Mobility',
      icon: '🧘',
      description: 'A gentle mobility and breath-focused session that restores movement quality.',
      exercises: [
        { name: 'Cat-Cow', sets: 2, reps: '10', rest: '15 sec', instructions: 'Move with breath and keep the neck long.' },
        { name: 'World’s Greatest Stretch', sets: 2, reps: '8 each', rest: '30 sec', instructions: 'Open the hips and thoracic spine with each repetition.' },
        { name: 'Standing Forward Fold', sets: 2, reps: '8', rest: '20 sec', instructions: 'Hinge from the hips and let the spine lengthen.' },
      ],
    },
    {
      id: 'recovery-stretch',
      name: 'Recovery Stretch',
      type: 'Stretching',
      difficulty: 'Beginner',
      duration: 15,
      calories: 90,
      equipment: 'Mat',
      muscleGroup: 'Full Body',
      focus: 'Recovery',
      icon: '🧘‍♂️',
      description: 'A low-impact stretching routine to reduce soreness and improve flexibility.',
      exercises: [
        { name: 'Hamstring Stretch', sets: 2, reps: '30 sec', rest: '15 sec', instructions: 'Keep the spine long and hinge gently.' },
        { name: 'Figure-Four Stretch', sets: 2, reps: '30 sec each', rest: '20 sec', instructions: 'Open the glutes without rounding the lower back.' },
        { name: 'Chest Opener', sets: 2, reps: '30 sec', rest: '15 sec', instructions: 'Pull blades down and back while you stretch the front body.' },
      ],
    },
    {
      id: 'full-body-builder',
      name: 'Full Body Builder',
      type: 'Full Body',
      difficulty: 'Intermediate',
      duration: 50,
      calories: 360,
      equipment: 'Bodyweight',
      muscleGroup: 'Full Body',
      focus: 'Strength',
      icon: '🏆',
      description: 'A total-body circuit combining resistance and timing for full-body development.',
      exercises: [
        { name: 'Push-ups', sets: 4, reps: '10', rest: '45 sec', instructions: 'Keep the body in one line and brace the core.' },
        { name: 'Split Squat', sets: 3, reps: '12 each', rest: '45 sec', instructions: 'Descend under control and drive through the front heel.' },
        { name: 'Bent-Over Row', sets: 3, reps: '12', rest: '45 sec', instructions: 'Pull elbows back and avoid shrugging the shoulders.' },
      ],
    },
    {
      id: 'bootcamp-intervals',
      name: 'Bootcamp Intervals',
      type: 'HIIT',
      difficulty: 'Advanced',
      duration: 35,
      calories: 410,
      equipment: 'Kettlebell',
      muscleGroup: 'Full Body',
      focus: 'HIIT',
      icon: '🥊',
      description: 'High-energy intervals to elevate conditioning and build athletic power.',
      exercises: [
        { name: 'Kettlebell Swing', sets: 4, reps: '15', rest: '30 sec', instructions: 'Hinge and power the hips through a controlled movement.' },
        { name: 'Jump Squat', sets: 4, reps: '12', rest: '20 sec', instructions: 'Land softly and stay balanced.' },
        { name: 'Push Press', sets: 4, reps: '12', rest: '30 sec', instructions: 'Drive the floor with your legs and finish with stable shoulders.' },
      ],
    },
  ];

  const DEFAULT_GOALS = [
    { id: 'goal-steps', title: 'Hit 10k steps', category: 'Steps', target: 10000, current: 7800, deadline: '2026-10-10', completed: false },
    { id: 'goal-workouts', title: 'Train 4 days', category: 'Workout', target: 4, current: 3, deadline: '2026-10-05', completed: false },
    { id: 'goal-water', title: 'Drink 2.5L water', category: 'Water', target: 2.5, current: 2.1, deadline: '2026-09-30', completed: false },
  ];

  const DEFAULT_PROGRESS = [
    { date: '2026-09-16', weight: 65.2, steps: 8200, calories: 510, notes: 'Strong lift session.' },
    { date: '2026-09-18', weight: 65.0, steps: 9150, calories: 560, notes: 'Good recovery and hydration.' },
    { date: '2026-09-20', weight: 64.8, steps: 9800, calories: 610, notes: 'Focused on steady cardio.' },
    { date: '2026-09-22', weight: 64.6, steps: 10130, calories: 640, notes: 'Best performance of the week.' },
  ];

  const DEFAULT_NUTRITION = {
    breakfast: [
      { id: 1, name: 'Greek Yogurt', calories: 220, protein: 18, carbs: 12, fat: 8, quantity: 1, meal: 'breakfast' },
    ],
    lunch: [
      { id: 2, name: 'Chicken Rice Bowl', calories: 520, protein: 42, carbs: 44, fat: 14, quantity: 1, meal: 'lunch' },
    ],
    dinner: [
      { id: 3, name: 'Salmon & Veggies', calories: 610, protein: 38, carbs: 26, fat: 22, quantity: 1, meal: 'dinner' },
    ],
    snacks: [
      { id: 4, name: 'Protein Shake', calories: 180, protein: 24, carbs: 6, fat: 2, quantity: 1, meal: 'snacks' },
    ],
  };

  const app = {
    STORAGE_KEYS,
    DEFAULT_PROFILE,
    DEFAULT_SETTINGS,
    DEFAULT_WORKOUTS,
    DEFAULT_GOALS,
    DEFAULT_PROGRESS,
    DEFAULT_NUTRITION,
  };

  function safeParse(raw, fallback) {
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function getStoredData(key, fallback) {
    const value = localStorage.getItem(key);
    return safeParse(value, fallback);
  }

  function setStoredData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function ensureDemoData() {
    if (!localStorage.getItem(STORAGE_KEYS.profile)) {
      setStoredData(STORAGE_KEYS.profile, DEFAULT_PROFILE);
    }

    if (!localStorage.getItem(STORAGE_KEYS.settings)) {
      setStoredData(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.workouts)) {
      setStoredData(STORAGE_KEYS.workouts, DEFAULT_WORKOUTS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.favorites)) {
      setStoredData(STORAGE_KEYS.favorites, ['lower-body-power']);
    }

    if (!localStorage.getItem(STORAGE_KEYS.completedWorkouts)) {
      setStoredData(STORAGE_KEYS.completedWorkouts, []);
    }

    if (!localStorage.getItem(STORAGE_KEYS.nutrition)) {
      setStoredData(STORAGE_KEYS.nutrition, DEFAULT_NUTRITION);
    }

    if (!localStorage.getItem(STORAGE_KEYS.progress)) {
      setStoredData(STORAGE_KEYS.progress, DEFAULT_PROGRESS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.goals)) {
      setStoredData(STORAGE_KEYS.goals, DEFAULT_GOALS);
    }
  }

  function getProfile() {
    return getStoredData(STORAGE_KEYS.profile, DEFAULT_PROFILE);
  }

  function saveProfile(profile) {
    setStoredData(STORAGE_KEYS.profile, profile);
  }

  function getSettings() {
    return getStoredData(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  }

  function saveSettings(settings) {
    setStoredData(STORAGE_KEYS.settings, settings);
  }

  function applyTheme() {
    const settings = getSettings();
    document.body.classList.toggle('dark-mode', Boolean(settings.darkMode));
  }

  function isLoggedIn() {
    const loginState = getStoredData(STORAGE_KEYS.login, { loggedIn: false });
    return Boolean(loginState && loginState.loggedIn);
  }

  function setLoggedIn(email) {
    setStoredData(STORAGE_KEYS.login, { loggedIn: true, email });
  }

  function logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.login);
    window.location.href = 'index.html';
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatShortDate(date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }

  function showMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = 'form-message';
    if (type) {
      element.classList.add(type);
    }
  }

  function getInitials(name) {
    return (name || 'AB')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  function initDate() {
    const dateNodes = document.querySelectorAll('#currentDate');
    const date = new Date();
    const dateText = date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    dateNodes.forEach((node) => {
      node.textContent = dateText;
    });
  }

  function initSidebar() {
    const currentPage = document.body.dataset.page || '';
    document.querySelectorAll('.nav-link').forEach((link) => {
      const page = link.dataset.page || '';
      if (page === currentPage) {
        link.classList.add('active');
      }
    });

    const mobileButton = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileButton && sidebar) {
      mobileButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024 && sidebar) {
          sidebar.classList.remove('open');
        }
      });
    });
  }

  function initLogoutButtons() {
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach((button) => {
      button.addEventListener('click', () => {
        logoutUser();
      });
    });
  }

  function initAuthPage() {
    const authPage = document.body.dataset.page === 'landing';
    if (!authPage) return;

    const loginState = getStoredData(STORAGE_KEYS.login, { loggedIn: false });
    if (loginState.loggedIn) {
      window.location.href = 'dashboard.html';
      return;
    }

    const submitButton = document.getElementById('submitAuthBtn');
    const toggleButton = document.getElementById('toggleAuthMode');
    const loginForm = document.getElementById('loginForm');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const switchText = document.getElementById('switchText');
    const confirmRow = document.getElementById('confirmRow');
    const messageNode = document.getElementById('authMessage');
    const demoButton = document.getElementById('demoLoginBtn');
    let isRegisterMode = false;

    function updateMode() {
      if (!authTitle || !authSubtitle || !switchText || !confirmRow || !submitButton) return;
      authTitle.textContent = isRegisterMode ? 'Create account' : 'Welcome back';
      authSubtitle.textContent = isRegisterMode
        ? 'Build your progress with FitTrack.'
        : 'Sign in to continue your fitness journey.';
      switchText.textContent = isRegisterMode ? 'Already have an account?' : 'Need an account?';
      toggleButton.textContent = isRegisterMode ? 'Sign in' : 'Create one';
      confirmRow.classList.toggle('hidden', !isRegisterMode);
      submitButton.textContent = isRegisterMode ? 'Create account' : 'Sign In';
    }

    toggleButton.addEventListener('click', () => {
      isRegisterMode = !isRegisterMode;
      updateMode();
    });

    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const confirmInput = document.getElementById('confirmPassword');
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const confirmPassword = confirmInput ? confirmInput.value.trim() : '';

      if (!email || !password) {
        showMessage(messageNode, 'Please enter your email and password.', 'error');
        return;
      }

      if (isRegisterMode && password !== confirmPassword) {
        showMessage(messageNode, 'Passwords do not match.', 'error');
        return;
      }

      const profile = getProfile();
      const updatedProfile = { ...profile, email, name: profile.name || 'New Member' };
      saveProfile(updatedProfile);

      setLoggedIn(email);
      showMessage(messageNode, isRegisterMode ? 'Account created successfully.' : 'Login successful.', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    });

    if (demoButton) {
      demoButton.addEventListener('click', () => {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        emailInput.value = 'demo@fittrack.com';
        passwordInput.value = 'demo123';
        setLoggedIn('demo@fittrack.com');
        showMessage(messageNode, 'Demo account ready. Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
      });
    }

    updateMode();
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureDemoData();
    applyTheme();
    initDate();
    initSidebar();
    initLogoutButtons();
    initAuthPage();

    const currentPage = document.body.dataset.page;
    if (!['landing'].includes(currentPage) && !isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    const profile = getProfile();
    const topbarNameNode = document.getElementById('topbarName');
    if (topbarNameNode) {
      topbarNameNode.textContent = profile.name || 'Ava Brooks';
    }

    const topbarAvatar = document.getElementById('topbarAvatar');
    if (topbarAvatar) {
      topbarAvatar.textContent = getInitials(profile.name);
    }

    const profileAvatarNode = document.getElementById('profileAvatar');
    if (profileAvatarNode) {
      profileAvatarNode.textContent = getInitials(profile.name);
    }
  });

  window.FitTrackApp = app;
  window.FitTrackApp.helpers = {
    getStoredData,
    setStoredData,
    getProfile,
    saveProfile,
    getSettings,
    saveSettings,
    applyTheme,
    isLoggedIn,
    setLoggedIn,
    logoutUser,
    formatDate,
    formatShortDate,
    showMessage,
    getInitials,
  };
})();
