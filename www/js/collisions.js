
// Collisions
function checkCollisions(){
    // Targets
    targets.forEach(t=>{
        let dx=player.x-t.x, dy=player.y-t.y;
        let d=Math.sqrt(dx*dx+dy*dy);
        if(d<player.radius+t.radius){
            player.color=t.color;
            player.score++;
            scoreEl.innerText = player.score;
            t.x=W + Math.random()*W;
            t.y=Math.random()*H;
            t.color=`hsl(${Math.random()*360},80%,60%)`;
        }
    });

    // Obstacles
    obstacles.forEach(o=>{
        let dx=player.x-o.x, dy=player.y-o.y;
        let d=Math.sqrt(dx*dx+dy*dy);
        if(d<player.radius+o.radius){
            if(player.boosters>0){
                player.boosters--;
                boostersEl.innerText = player.boosters;
                createFirework(o.x,o.y, Math.ceil(o.radius/10));
                player.score += Math.ceil(o.radius/10);
                scoreEl.innerText = player.score;
                o.x=W+Math.random()*W;
                o.y=Math.random()*H;
            } else {
                player.score = Math.max(0,player.score-2);
                scoreEl.innerText=player.score;
                player.x=100;
                player.y=H/2;
            }
        }
    });

    // Boosters
    boosterList.forEach(b=>{
        let dx=player.x-b.x, dy=player.y-b.y;
        let d=Math.sqrt(dx*dx+dy*dy);
        if(d<player.radius+b.radius){
            player.boosters++;
            boostersEl.innerText=player.boosters;
            b.x=W+Math.random()*W*2;
            b.y=Math.random()*H;
        }
    });

    // Monsters
    monsters.forEach(m=>{
        let dx=player.x-m.x, dy=player.y-m.y;
        let d=Math.sqrt(dx*dx+dy*dy);
        if(d<player.radius+m.radius){
            if(player.boosters>=3){
                player.boosters-=3;
                boostersEl.innerText=player.boosters;
                createFirework(m.x,m.y,5); // big fireworks
                player.score += 5;
                scoreEl.innerText = player.score;
                m.x=W + Math.random()*W;
                m.y=Math.random()*H;
            } else {
                player.score = Math.max(0,player.score-5);
                scoreEl.innerText=player.score;
                player.x=100;
                player.y=H/2;
            }
        }
    });
}
