
// Initialize targets
function spawnTargets(){
    targets=[];
    for(let i=0;i<numTargets;i++){
        targets.push({
            x: W + Math.random()*W*2,
            y: Math.random()*H,
            radius:10+Math.random()*5,
            color:`hsl(${Math.random()*360},80%,60%)`
        });
    }
}

// Initialize obstacles
function spawnObstacles(){
    obstacles=[];
    for(let i=0;i<numObstacles;i++){
        obstacles.push({
            x: W + Math.random()*W*3,
            y: Math.random()*H,
            radius:20+Math.random()*10
        });
    }
}

// Initialize boosters
function spawnBoosters(){
    boosterList=[];
    for(let i=0;i<numBoosters;i++){
        boosterList.push({
            x: W + Math.random()*W*4,
            y: Math.random()*H,
            radius:16, // Bigger triangle
            color:'magenta'
        });
    }
}

// Initialize monsters
function spawnMonsters(){
    monsters=[];
    if(level>=3){ // appear from level 3
        monsters.push({
            x: W + 300,
            y: Math.random()*(H-100)+50,
            radius:30,
            vx:-1.5
        });
    }
}
