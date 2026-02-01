
const canvas=document.getElementById('c');
const ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score');
const levelEl=document.getElementById('level');
const boostersEl=document.getElementById('boosters');

let W,H;
function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  // clear background cache so gradients are recreated at new size
  if (window._bgCache) window._bgCache = {}; 
}
window.addEventListener('resize', resize);
resize();

// Player
let player={x:100, y:H/2, vx:0, vy:0, color:'cyan', radius:12, score:0, boosters:0};

// Mouse gravity
let mouse={x:player.x, y:player.y};

// Keyboard & pointer lock handling
window.pointerLocked = window.pointerLocked || false;
window.keyboardControlEnabled = typeof window.keyboardControlEnabled === 'undefined' ? true : window.keyboardControlEnabled;

window.addEventListener('mousemove', e => {
  // If pointer is locked to keyboard control, ignore pointer updates
  if (!window.pointerLocked) updatePointer(e.clientX, e.clientY);
});

window.addEventListener('touchmove', e => {
  const t = e.touches[0];
  if (!window.pointerLocked) updatePointer(t.clientX, t.clientY);
}, { passive: true });

// keyboard controls for nudging gravity and toggles (L, Space, H)
document.addEventListener('keydown', (e) => {
  // ignore when typing into inputs
  const tag = (document.activeElement && document.activeElement.tagName) || '';
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

  // Help
  if (e.key === 'h' || e.key === 'H') {
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) helpBtn.click();
    return;
  }

  if (!window.keyboardControlEnabled) return;

  if (e.key === 'l' || e.key === 'L' || e.code === 'Space') {
    window.pointerLocked = !window.pointerLocked;
    const lockEl = document.getElementById('lock-indicator');
    if (lockEl) lockEl.innerText = window.pointerLocked ? 'on' : 'off';
    const canvasEl = document.getElementById('c');
    if (canvasEl) canvasEl.style.cursor = window.pointerLocked ? 'none' : (window.pointerShape ? 'none' : 'default');
    e.preventDefault();
    return;
  }

  // Arrow keys nudge the gravity field
  const step = e.shiftKey ? 30 : 10;
  switch (e.key) {
    case 'ArrowUp': mouse.y = Math.max(0, mouse.y - step); e.preventDefault(); break;
    case 'ArrowDown': mouse.y = Math.min(H, mouse.y + step); e.preventDefault(); break;
    case 'ArrowLeft': mouse.x = Math.max(0, mouse.x - step); e.preventDefault(); break;
    case 'ArrowRight': mouse.x = Math.min(W, mouse.x + step); e.preventDefault(); break;
  }
});


// Side-scrolling
let scrollSpeed=2;
let level=1;

// Targets
let targets=[], numTargets=5;

// Obstacles (red circles)
let obstacles=[], numObstacles=3;

// Boosters (big triangles)
let boosterList=[], numBoosters=2;

// Monster
let monsters=[];

// Fireworks
let fireworks=[];

spawnTargets();
spawnObstacles();
spawnBoosters();
spawnMonsters();

// Firework particle
function createFirework(x,y,intensity){
    for(let i=0;i<intensity*10;i++){
        fireworks.push({
            x:x, y:y,
            vx:(Math.random()-0.5)*intensity*3,
            vy:(Math.random()-0.5)*intensity*3,
            life:60+Math.random()*30,
            color:`hsl(${Math.random()*360},80%,60%)`
        });
    }
}

// Trail (state kept here, drawing is delegated to `draw.js`)
let trail=[];

// Level
function checkLevel(){
    let newLevel = Math.floor(player.score/10)+1;
    if(newLevel>level){
        level=newLevel;
        scrollSpeed+=0.5;
        numTargets+=1;
        numObstacles+=1;
        spawnTargets();
        spawnObstacles();
        spawnBoosters();
        spawnMonsters();
        levelEl.innerText = level;
    }
}

// Small audio helper (simple oscillator beeps)
function playSound(type){
  try{
    if (!window.soundsEnabled) return;
    const ctxAudio = window._audioCtx = window._audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = ctxAudio.createOscillator();
    const g = ctxAudio.createGain();
    o.type = 'sine';
    if (type === 'collect') o.frequency.value = 880;
    else if (type === 'hit') o.frequency.value = 220;
    else if (type === 'booster') o.frequency.value = 1200;
    else o.frequency.value = 440;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctxAudio.destination);
    o.start();
    setTimeout(()=>{ o.stop(); g.disconnect(); }, 100);
  }catch(e){ /* ignore if audio unavailable */ }
}

// Animate
function drawBackground(mode){
    window._bgCache = window._bgCache || {};
    const mult = window.bgBrightness || 1;
    const A = (v) => (window.trailsEnabled ? Math.min(1, v * mult) : 1);
    const key = `${mode}|${W}x${H}|${Math.round(mult*100)}|${window.bgGrade||'none'}`;

    if (!window._bgCache[key]){
      // create and cache a draw function for this mode/size/brightness
      let drawFn;
      switch(mode){
        case 'black':
          drawFn = () => { ctx.fillStyle = `rgba(0,0,0,${A(0.2)})`; ctx.fillRect(0,0,W,H); };
          break;
        case 'sky': {
          const bg = ctx.createRadialGradient(W*0.2, H*0.15, 0, W*0.2, H*0.15, Math.max(W,H)*0.9);
          bg.addColorStop(0, `rgba(31,182,255,${A(0.12)})`);
          bg.addColorStop(0.35, `rgba(123,47,247,${A(0.06)})`);
          bg.addColorStop(1, `rgba(0,0,0,${A(0.16)})`);
          drawFn = () => { ctx.fillStyle = bg; ctx.fillRect(0,0,W,H); };
        } break;
        case 'purple': {
          const bg = ctx.createRadialGradient(W*0.25, H*0.2, 0, W*0.25, H*0.2, Math.max(W,H)*0.9);
          bg.addColorStop(0, `rgba(95,62,150,${A(0.12)})`);
          bg.addColorStop(0.5, `rgba(31,182,255,${A(0.06)})`);
          bg.addColorStop(1, `rgba(0,0,0,${A(0.16)})`);
          drawFn = () => { ctx.fillStyle = bg; ctx.fillRect(0,0,W,H); };
        } break;
        case 'ocean': {
          const lg = ctx.createLinearGradient(0,0,0,H);
          lg.addColorStop(0, `rgba(31,182,255,${A(0.10)})`);
          lg.addColorStop(0.6, `rgba(8,50,62,${A(0.08)})`);
          lg.addColorStop(1, `rgba(0,0,0,${A(0.16)})`);
          drawFn = () => { ctx.fillStyle = lg; ctx.fillRect(0,0,W,H); };
        } break;
        case 'white':
          drawFn = () => { ctx.fillStyle = '#fafafa'; ctx.fillRect(0,0,W,H); };
          break;
        case 'dusk':
        default: {
          const bg = ctx.createRadialGradient(W*0.25, H*0.1, 0, W*0.25, H*0.1, Math.max(W,H)*0.8);
          bg.addColorStop(0, `rgba(255,200,170,${A(0.08)})`);
          bg.addColorStop(0.5, `rgba(80,50,120,${A(0.06)})`);
          bg.addColorStop(1, `rgba(0,0,0,${A(0.12)})`);
          drawFn = () => { ctx.fillStyle = bg; ctx.fillRect(0,0,W,H); };
        }
      }
      window._bgCache[key] = drawFn;
    }

    // execute cached draw function
    window._bgCache[key]();

    // Color grade overlay (subtle)
    applyColorGrade();
}

function applyColorGrade(){
    const grade = window.bgGrade || 'none';
    const mult = window.bgBrightness || 1;
    if (grade === 'none') return;
    ctx.save();
    let color = null;
    let op = 'overlay';
    if (grade === 'warm') color = `rgba(255,160,110,${0.05*mult})`;
    else if (grade === 'cool') color = `rgba(80,140,255,${0.05*mult})`;
    else if (grade === 'desat') { color = `rgba(128,128,128,${0.08*mult})`; op = 'multiply'; }
    ctx.globalCompositeOperation = op;
    ctx.fillStyle = color;
    ctx.fillRect(0,0,W,H);
    ctx.restore();
} 

function animate(){
    drawBackground(window.bgMode || 'sky');

    updatePlayer();
    updateWorld();
    checkCollisions();
    checkLevel();

    drawTrail();
    drawTargets();
    drawObstacles();
    drawBoosters();
    drawMonsters();
    drawPlayer();
    drawFireworks();

    // Custom pointer drawn on top of everything
    if (typeof drawPointer === 'function') drawPointer();

    requestAnimationFrame(animate);
}

animate();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}