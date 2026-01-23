
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
function animate(){
    ctx.fillStyle='rgba(0,0,0,0.15)';
    ctx.fillRect(0,0,W,H);

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