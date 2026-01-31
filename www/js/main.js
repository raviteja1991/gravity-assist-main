
const canvas=document.getElementById('c');
const ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score');
const levelEl=document.getElementById('level');
const boostersEl=document.getElementById('boosters');

let W,H;
function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
window.addEventListener('resize',resize);
resize();

// Player
let player={x:100, y:H/2, vx:0, vy:0, color:'cyan', radius:12, score:0, boosters:0};

// Mouse gravity
let mouse={x:player.x, y:player.y};

window.addEventListener('mousemove', e =>
  updatePointer(e.clientX, e.clientY)
);

window.addEventListener('touchmove', e => {
  const t = e.touches[0];
  updatePointer(t.clientX, t.clientY);
}, { passive: true });


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

// Trail
let trail=[];
function drawTrail(){
    trail.push({x:player.x, y:player.y, color:player.color});
    if(trail.length>100) trail.shift();
    trail.forEach((p,i)=>{
        ctx.fillStyle=p.color;
        ctx.globalAlpha = i/trail.length*0.6;
        ctx.beginPath();
        ctx.arc(p.x,p.y,5,0,Math.PI*2);
        ctx.fill();
    });
    ctx.globalAlpha=1;
}

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

// Animate
function drawBackground(mode){
    const mult = window.bgBrightness || 1;
    const alpha = (v) => Math.min(1, v * mult);
    const A = (v) => (window.trailsEnabled ? alpha(v) : 1);

    // Default small fade to preserve trail visibility (disabled => full clear)
    switch(mode){
      case 'black':
        ctx.fillStyle = `rgba(0,0,0,${A(0.2)})`;
        ctx.fillRect(0,0,W,H);
        break;
      case 'sky': {
        const bg = ctx.createRadialGradient(W*0.2, H*0.15, 0, W*0.2, H*0.15, Math.max(W,H)*0.9);
        bg.addColorStop(0, `rgba(31,182,255,${A(0.12)})`);
        bg.addColorStop(0.35, `rgba(123,47,247,${A(0.06)})`);
        bg.addColorStop(1, `rgba(0,0,0,${A(0.16)})`);
        ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
      } break;
      case 'purple': {
        const bg = ctx.createRadialGradient(W*0.25, H*0.2, 0, W*0.25, H*0.2, Math.max(W,H)*0.9);
        bg.addColorStop(0, `rgba(95,62,150,${A(0.12)})`);
        bg.addColorStop(0.5, `rgba(31,182,255,${A(0.06)})`);
        bg.addColorStop(1, `rgba(0,0,0,${A(0.16)})`);
        ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
      } break;
      case 'ocean': {
        const lg = ctx.createLinearGradient(0,0,0,H);
        lg.addColorStop(0, `rgba(31,182,255,${A(0.10)})`);
        lg.addColorStop(0.6, `rgba(8,50,62,${A(0.08)})`);
        lg.addColorStop(1, `rgba(0,0,0,${A(0.16)})`);
        ctx.fillStyle = lg; ctx.fillRect(0,0,W,H);
      } break;
      case 'white': {
        // Soft white background (easier on eyes than pure #fff)
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(0,0,W,H);
      } break;
      case 'dusk':
      default: {
        const bg = ctx.createRadialGradient(W*0.25, H*0.1, 0, W*0.25, H*0.1, Math.max(W,H)*0.8);
        bg.addColorStop(0, `rgba(255,200,170,${A(0.08)})`);
        bg.addColorStop(0.5, `rgba(80,50,120,${A(0.06)})`);
        bg.addColorStop(1, `rgba(0,0,0,${A(0.12)})`);
        ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
      }
    }

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

    requestAnimationFrame(animate);
}

animate();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}