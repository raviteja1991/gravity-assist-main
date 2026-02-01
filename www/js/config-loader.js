// Lightweight config loader - sets window.APP_CONFIG and applies simple runtime wiring
(function(){
  const DEFAULTS = {
    app: { name: 'Gravity Assist', version: '0.0' },
    cacheName: 'gravity-assist-cache-v0',
    theme: { brandBlue: '#1fb6ff', brandPurple: '#7b2ff7', background: '#000000' },
    defaults: { brightness: 100, trails: false, sounds: false, keyboard: false, pointer: 'dot', bg: 'black' },
    physics: { acceleration: 0.01, friction: 0.92, respawnOffset: 50 },
    spawn: { targetHueRange: [0,360], targetSat: '80%', targetLight: '60%' }
  };

  async function load(){
    try {
      const res = await fetch('config.json', {cache: 'no-store'});
      if (res.ok){
        const cfg = await res.json();
        window.APP_CONFIG = Object.assign({}, DEFAULTS, cfg);
        
      } else {
        window.APP_CONFIG = DEFAULTS;
      }
    } catch (e){
      window.APP_CONFIG = DEFAULTS;
    }

    // Apply theme CSS variables if present
    try {
      const theme = window.APP_CONFIG.theme || {};
      if (theme.brandBlue) document.documentElement.style.setProperty('--brand-blue', theme.brandBlue);
      if (theme.brandPurple) document.documentElement.style.setProperty('--brand-purple', theme.brandPurple);
      if (theme.background) {
        document.querySelector('meta[name="theme-color"]').setAttribute('content', theme.background);
      }
    } catch(e){}

    // Update UI elements that depend on config
    try {
      const verEl = document.getElementById('version-label');

      if (verEl && window.APP_CONFIG && window.APP_CONFIG.app && window.APP_CONFIG.app.version) {
        verEl.textContent = 'v' + window.APP_CONFIG.app.version;
      }
    } catch(e){}
  }

  // Provide immediate defaults so other scripts have safe fallback while fetch completes
  window.APP_CONFIG = DEFAULTS;
  load();
})();