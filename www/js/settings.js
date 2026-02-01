// Settings: background mode selector
(function(){
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeBtn = document.querySelector('.close-settings');
  const bgOptions = document.getElementById('bg-options');

  const APP_DEFAULTS = (window.APP_CONFIG && window.APP_CONFIG.defaults) || {};
  const DEFAULT = APP_DEFAULTS.bg || 'black';
  const KEY = 'gravity-bg-mode';
  const BRIGHT_KEY = 'gravity-bg-brightness';
  const GRADE_KEY = 'gravity-bg-grade';
  const MODES = ['black','sky','purple','ocean','white','dusk'];

  // Read saved mode or default (validate against supported modes)
  let saved = localStorage.getItem(KEY) || DEFAULT;
  if (!MODES.includes(saved)) saved = DEFAULT;
  window.bgMode = saved;

  // brightness: percent 50..150 default 100
  let savedBright = parseInt(localStorage.getItem(BRIGHT_KEY), 10);
  if (!savedBright || isNaN(savedBright)) savedBright = (typeof APP_DEFAULTS.brightness === 'number' ? APP_DEFAULTS.brightness : 100);
  window.bgBrightness = savedBright / 100;  

  // grade: none|warm|cool|desat
  let savedGrade = localStorage.getItem(GRADE_KEY) || 'none';
  const GRADES = ['none','warm','cool','desat'];
  if (!GRADES.includes(savedGrade)) savedGrade = 'none';
  window.bgGrade = savedGrade;

  // Trails setting (default from config)
  const TRAIL_KEY = 'gravity-trails-enabled';
  let savedTrail = localStorage.getItem(TRAIL_KEY);
  if (savedTrail === null) savedTrail = (APP_DEFAULTS.trails ? 'true' : 'false');
  window.trailsEnabled = (savedTrail === 'true');

  // Accessibility: keep track of previous active element and keyboard handler for modal
  let _prevActiveElement = null;
  function _handleModalKeydown(e){
    if (e.key === 'Escape'){
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusables = settingsModal.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey){
      if (document.activeElement === first){ e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  function open(){
    _prevActiveElement = document.activeElement;
    settingsModal.style.display = 'block';
    // set radio checked state
    const radios = bgOptions.querySelectorAll('input[type=radio]');
    radios.forEach(r => { r.checked = (r.value === window.bgMode); });

    // make swatch labels focusable for keyboard users
    bgOptions.querySelectorAll('.swatch-label').forEach(l => l.tabIndex = 0);
    const pointerGroup = document.getElementById('pointer-options');
    if (pointerGroup) pointerGroup.querySelectorAll('.pointer-label').forEach(l => l.tabIndex = 0);

    // focus the checked swatch for quick keyboard navigation
    const checkedBg = bgOptions.querySelector('input[type=radio]:checked');
    if (checkedBg && checkedBg.parentElement) checkedBg.parentElement.focus();

    // sync controls
    document.getElementById('bg-brightness').value = Math.round(window.bgBrightness * 100);
    document.getElementById('bg-brightness-value').innerText = Math.round(window.bgBrightness * 100) + '%';
    document.getElementById('bg-grade').value = window.bgGrade;

    // Add keyboard listener to support Escape and focus trap
    document.addEventListener('keydown', _handleModalKeydown);
  }
  function close(){
    settingsModal.style.display = 'none';
    document.removeEventListener('keydown', _handleModalKeydown);
    if (_prevActiveElement && typeof _prevActiveElement.focus === 'function') {
      _prevActiveElement.focus();
    }
  }

  settingsBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  window.addEventListener('click', (e)=>{
    if(e.target === settingsModal) close();
  });

  bgOptions.addEventListener('change', (e)=>{
    const r = e.target;
    if(r && r.name === 'bg'){
      window.bgMode = r.value;
      localStorage.setItem(KEY, r.value);
    }
  });

  const brightnessEl = document.getElementById('bg-brightness');
  const brightnessValueEl = document.getElementById('bg-brightness-value');
  brightnessEl.value = Math.round(window.bgBrightness * 100);
  brightnessValueEl.innerText = brightnessEl.value + '%';
  brightnessEl.addEventListener('input', (e)=>{
    const v = parseInt(e.target.value,10);
    brightnessValueEl.innerText = v + '%';
    window.bgBrightness = v/100;
    localStorage.setItem(BRIGHT_KEY, String(v));
  });

  const gradeEl = document.getElementById('bg-grade');
  gradeEl.value = window.bgGrade;
  gradeEl.addEventListener('change', (e)=>{
    window.bgGrade = e.target.value;
    localStorage.setItem(GRADE_KEY, window.bgGrade);
  });

  // Trail toggle control
  const trailToggle = document.getElementById('trail-toggle');
  if (trailToggle) trailToggle.checked = !!window.trailsEnabled;
  trailToggle && trailToggle.addEventListener('change', (e)=>{
    window.trailsEnabled = !!e.target.checked;
    localStorage.setItem(TRAIL_KEY, window.trailsEnabled ? 'true' : 'false');
  });

  // Pointer shape (dot, ring, crosshair, triangle, plus)
  const POINTER_KEY = 'gravity-pointer-shape';
  const POINTERS = ['dot','ring','crosshair','triangle','plus'];
  const DEFAULT_POINTER = APP_DEFAULTS.pointer || 'dot';
  let savedPointer = localStorage.getItem(POINTER_KEY) || DEFAULT_POINTER;
  if (!POINTERS.includes(savedPointer)) savedPointer = DEFAULT_POINTER;
  window.pointerShape = savedPointer;

  // Sounds toggle
  const SOUND_KEY = 'gravity-sounds-enabled';
  let savedSounds = localStorage.getItem(SOUND_KEY);
  if (savedSounds === null) savedSounds = (APP_DEFAULTS.sounds ? 'true' : 'false');
  window.soundsEnabled = (savedSounds === 'true');

  // Keyboard control toggle (enable arrow key control)
  const KEYBOARD_KEY = 'gravity-keyboard-control';
  let savedKeyboard = localStorage.getItem(KEYBOARD_KEY);
  if (savedKeyboard === null) savedKeyboard = (APP_DEFAULTS.keyboard ? 'true' : 'false');
  window.keyboardControlEnabled = (savedKeyboard === 'true');
  // pointer locked (when true, mousemove won't alter the gravity field)
  window.pointerLocked = false;

  // Apply initial cursor visibility (hide system cursor when using custom pointer)
  const canvasEl = document.getElementById('c');
  if (canvasEl) canvasEl.style.cursor = (window.pointerShape ? 'none' : 'default');

  // Initialize UI and event listeners for pointer options
  const pointerOptions = document.getElementById('pointer-options');
  if (pointerOptions){
    // set radio state
    const radios = pointerOptions.querySelectorAll('input[type=radio]');
    radios.forEach(r => { r.checked = (r.value === window.pointerShape); });

    pointerOptions.addEventListener('change', (e)=>{
      const r = e.target;
      if(r && r.name === 'pointer'){
        window.pointerShape = r.value;
        localStorage.setItem(POINTER_KEY, r.value);
        // hide system cursor when using custom pointer
        if (canvasEl) canvasEl.style.cursor = (r.value ? 'none' : 'default');
      }
    });
  }

  // Wire up sound toggle control
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) soundToggle.checked = !!window.soundsEnabled;
  soundToggle && soundToggle.addEventListener('change', (e)=>{
    window.soundsEnabled = !!e.target.checked;
    localStorage.setItem(SOUND_KEY, window.soundsEnabled ? 'true' : 'false');
  });

  // Wire up keyboard control toggle
  const keyboardToggle = document.getElementById('keyboard-toggle');
  if (keyboardToggle) keyboardToggle.checked = !!window.keyboardControlEnabled;
  keyboardToggle && keyboardToggle.addEventListener('change', (e)=>{
    window.keyboardControlEnabled = !!e.target.checked;
    localStorage.setItem(KEYBOARD_KEY, window.keyboardControlEnabled ? 'true' : 'false');
  });

})();