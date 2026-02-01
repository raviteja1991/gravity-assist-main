
// Collisions
function checkCollisions(){
    // Targets (use squared distances for perf)
    targets.forEach(t=>{
        const dx = player.x - t.x, dy = player.y - t.y;
        const rSum = player.radius + t.radius;
        if (dx*dx + dy*dy < rSum*rSum) {
            player.color = t.color;
            player.score++;
            scoreEl.innerText = player.score;
            t.x = W + Math.random()*W;
            t.y = Math.random()*H;
            t.color = `hsl(${Math.random()*360},80%,60%)`;
            // sound feedback
            if (typeof playSound === 'function') playSound('collect');
        }
    });

    // Obstacles
    obstacles.forEach(o=>{
        const dx = player.x - o.x, dy = player.y - o.y;
        const rSum = player.radius + o.radius;
        if (dx*dx + dy*dy < rSum*rSum) {
            if (player.boosters > 0) {
                player.boosters--;
                boostersEl.innerText = player.boosters;
                createFirework(o.x, o.y, Math.ceil(o.radius/10));
                player.score += Math.ceil(o.radius/10);
                scoreEl.innerText = player.score;
                o.x = W + Math.random()*W;
                o.y = Math.random()*H;
                if (typeof playSound === 'function') playSound('booster');
            } else {
                player.score = Math.max(0, player.score - 2);
                scoreEl.innerText = player.score;
                player.x = 100;
                player.y = H/2;
                if (typeof playSound === 'function') playSound('hit');
            }
        }
    });

    // Boosters
    boosterList.forEach(b=>{
        const dx = player.x - b.x, dy = player.y - b.y;
        const rSum = player.radius + b.radius;
        if (dx*dx + dy*dy < rSum*rSum) {
            player.boosters++;
            boostersEl.innerText = player.boosters;
            b.x = W + Math.random()*W*2;
            b.y = Math.random()*H;
        }
    });

    // Monsters
    monsters.forEach(m=>{
        const dx = player.x - m.x, dy = player.y - m.y;
        const rSum = player.radius + m.radius;
        if (dx*dx + dy*dy < rSum*rSum) {
            if (player.boosters >= 3) {
                player.boosters -= 3;
                boostersEl.innerText = player.boosters;
                createFirework(m.x, m.y, 5); // big fireworks
                player.score += 5;
                scoreEl.innerText = player.score;
                m.x = W + Math.random()*W;
                m.y = Math.random()*H;
            } else {
                player.score = Math.max(0, player.score - 5);
                scoreEl.innerText = player.score;
                player.x = 100;
                player.y = H/2;
            }
        }
    });
}
