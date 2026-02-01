// Version info (resolved from APP_CONFIG if available)
let VERSION_NUMBER = (window.APP_CONFIG && window.APP_CONFIG.app && window.APP_CONFIG.app.version) || 'unknown';
let BUILD_DATE = new Date(); // fallback
let BUILD_SHA = 'unknown';

// try to load generated build-meta.json if present
fetch('build-meta.json')
  .then(r => {
    if (!r.ok) throw new Error('no build-meta');
    return r.json();
  })
  .then(m => { BUILD_DATE = new Date(m.date); BUILD_SHA = m.sha; })
  .catch(()=>{});

// Elements
const versionLabel = document.getElementById('version-label');
const modal = document.getElementById('version-modal');
// Scope the close button to the version modal to avoid clashing with other '.close-btn' elements
const closeBtn = modal.querySelector('.close-btn');
const versionInfo = document.getElementById('version-info');

// Accessibility helpers for modal
let _versionPrevActive = null;
function _versionKeydownHandler(e){
  if (e.key === 'Escape'){
    e.preventDefault();
    closeModal();
    return;
  }
  if (e.key !== 'Tab') return;
  const focusables = modal.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey){ if (document.activeElement === first){ e.preventDefault(); last.focus(); } }
  else { if (document.activeElement === last){ e.preventDefault(); first.focus(); } }
}

function openModal(){
    _versionPrevActive = document.activeElement;
    const version = (window.APP_CONFIG && window.APP_CONFIG.app && window.APP_CONFIG.app.version) || VERSION_NUMBER;

    versionInfo.innerHTML = `
        <strong>Version:</strong> ${version} <br><br>
        <strong>Build:</strong> ${BUILD_DATE.toLocaleString()} <br><br>
        <strong>Other Info:</strong> Gravity Assist Game
    `;
    modal.style.display = 'block';
    // focus the close button for keyboard users
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', _versionKeydownHandler);
}

function closeModal(){
    modal.style.display = 'none';
    document.removeEventListener('keydown', _versionKeydownHandler);
    if (_versionPrevActive && typeof _versionPrevActive.focus === 'function') _versionPrevActive.focus();
}

// Click version label → open modal
versionLabel.addEventListener('click', openModal);

// Close modal when click X
closeBtn && closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside the modal box
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        closeModal();
    }
});
