// Help modal accessibility + first-run onboarding
(function(){
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const closeBtn = helpModal.querySelector('.close-help');
  let _prevActive = null;

  function _keyHandler(e){
    if (e.key === 'Escape') { close(); }
    if (e.key === 'H' || e.key === 'h') { open(); }
    if (e.key === 'Tab') {
      const focusables = helpModal.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length-1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  function open(){
    _prevActive = document.activeElement;
    helpModal.style.display = 'block';
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', _keyHandler);
  }
  function close(){
    helpModal.style.display = 'none';
    document.removeEventListener('keydown', _keyHandler);
    if (_prevActive && typeof _prevActive.focus === 'function') _prevActive.focus();
  }

  helpBtn && helpBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  window.addEventListener('click', (e)=>{ if (e.target === helpModal) close(); });

  // Show on first run
  const FIRST_KEY = 'gravity-first-run';
  const first = localStorage.getItem(FIRST_KEY);
  if (first === null) {
    // show help modal once
    setTimeout(()=>{ open(); localStorage.setItem(FIRST_KEY, 'seen'); }, 600);
  }
})();