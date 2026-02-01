function updatePointer(x, y) {
  mouse.x = x;
  mouse.y = y;
}

// Update player
function updatePlayer(){
    let dx = mouse.x - player.x;
    let dy = mouse.y - player.y;
    const acc = (window.APP_CONFIG && window.APP_CONFIG.physics && typeof window.APP_CONFIG.physics.acceleration === 'number') ? window.APP_CONFIG.physics.acceleration : 0.01;
    player.vx += dx * acc;
    player.vy += dy * acc;
    const friction = (window.APP_CONFIG && window.APP_CONFIG.physics && typeof window.APP_CONFIG.physics.friction === 'number') ? window.APP_CONFIG.physics.friction : 0.92;
    player.vx *= friction;
    player.vy *= friction;
    player.x += player.vx;
    player.y += player.vy;

    // Wrap around screen edges
    if (player.x < 0) player.x = W;
    else if (player.x > W) player.x = 0;
    if (player.y < 0) player.y = H;
    else if (player.y > H) player.y = 0;
}

// Update world
function updateWorld(){
    const respawnOffset = (window.APP_CONFIG && window.APP_CONFIG.physics && typeof window.APP_CONFIG.physics.respawnOffset === 'number') ? window.APP_CONFIG.physics.respawnOffset : 50;
    const spawnCfg = (window.APP_CONFIG && window.APP_CONFIG.spawn) || {};
    const hueRange = spawnCfg.targetHueRange || [0,360];
    const sat = spawnCfg.targetSat || '80%';
    const light = spawnCfg.targetLight || '60%';

    targets.forEach(t=> t.x -= scrollSpeed);
    obstacles.forEach(o=> o.x -= scrollSpeed);
    boosterList.forEach(b=> b.x -= scrollSpeed);
    monsters.forEach(m=> m.x += m.vx);

    targets.forEach(t=>{ if(t.x < -respawnOffset){ t.x = W + Math.random()*W; t.y = Math.random()*H; const hue = Math.random()*(hueRange[1]-hueRange[0]) + hueRange[0]; t.color = `hsl(${hue},${sat},${light})`; }});
    obstacles.forEach(o=>{ if(o.x < -respawnOffset){ o.x = W + Math.random()*W; o.y = Math.random()*H; }});
    boosterList.forEach(b=>{ if(b.x < -respawnOffset){ b.x = W + Math.random()*W*2; b.y = Math.random()*H; }});
    monsters.forEach(m=>{ if(m.x < -respawnOffset){ m.x = W + Math.random()*W; m.y = Math.random()*H; }});
}