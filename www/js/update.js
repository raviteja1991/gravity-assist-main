function updatePointer(x, y) {
  mouse.x = x;
  mouse.y = y;
}

// Update player
function updatePlayer(){
    let dx = mouse.x - player.x;
    let dy = mouse.y - player.y;
    player.vx += dx*0.01;
    player.vy += dy*0.01;
    player.vx *= 0.92;
    player.vy *= 0.92;
    player.x += player.vx;
    player.y += player.vy;

    if(player.y<0) player.y=0;
    if(player.y>H) player.y=H;
}

// Update world
function updateWorld(){
    targets.forEach(t=> t.x -= scrollSpeed);
    obstacles.forEach(o=> o.x -= scrollSpeed);
    boosterList.forEach(b=> b.x -= scrollSpeed);
    monsters.forEach(m=> m.x += m.vx);

    targets.forEach(t=>{ if(t.x<-50){ t.x=W+Math.random()*W; t.y=Math.random()*H; t.color=`hsl(${Math.random()*360},80%,60%)`; }});
    obstacles.forEach(o=>{ if(o.x<-50){ o.x=W+Math.random()*W; o.y=Math.random()*H; }});
    boosterList.forEach(b=>{ if(b.x<-50){ b.x=W+Math.random()*W*2; b.y=Math.random()*H; }});
    monsters.forEach(m=>{ if(m.x<-50){ m.x=W+Math.random()*W; m.y=Math.random()*H; }});
}