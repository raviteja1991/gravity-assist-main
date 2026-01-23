
// Draw player
function drawPlayer(){
    ctx.fillStyle=player.color;
    ctx.beginPath();
    ctx.arc(player.x,player.y,player.radius,0,Math.PI*2);
    ctx.fill();
}

// Draw targets
function drawTargets(){
    targets.forEach(t=>{
        ctx.fillStyle=t.color;
        ctx.beginPath();
        ctx.arc(t.x,t.y,t.radius,0,Math.PI*2);
        ctx.fill();
    });
}

// Draw obstacles
function drawObstacles(){
    ctx.strokeStyle='rgba(255,0,0,0.6)';
    ctx.lineWidth=3;
    obstacles.forEach(o=>{
        ctx.beginPath();
        ctx.arc(o.x,o.y,o.radius,0,Math.PI*2);
        ctx.stroke();
    });
}

// Draw boosters
function drawBoosters(){
    boosterList.forEach(b=>{
        ctx.fillStyle=b.color;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y - b.radius);
        ctx.lineTo(b.x - b.radius, b.y + b.radius);
        ctx.lineTo(b.x + b.radius, b.y + b.radius);
        ctx.closePath();
        ctx.fill();
    });
}

// Draw monsters
function drawMonsters(){
    monsters.forEach(m=>{
        ctx.fillStyle='darkred';
        ctx.beginPath();
        ctx.arc(m.x,m.y,m.radius,0,Math.PI*2);
        ctx.fill();
    });
}

// Draw firework
function drawFireworks(){
    fireworks.forEach(f=>{
        ctx.fillStyle=f.color;
        ctx.beginPath();
        ctx.arc(f.x,f.y,2,0,Math.PI*2);
        ctx.fill();
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.05; // gravity on particles
        f.life--;
    });
    fireworks = fireworks.filter(f=>f.life>0);
}

// Trail effect
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