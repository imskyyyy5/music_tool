const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 400;
const groundY = 340;
const player = {
    x:100,
    y:290,
    width:40,
    height: 48,
    velocityY:0,
    gravity : 0.6,
    jumpStrength:-14,
    onGround:false,
    jumps:0
};
const obstacles = [];
const particles= [];
const coins=[];
let coinSpawnTimer= 0;
const obstacleSpeed = 3;
let spawnTimer = 0;
let spawnInterval = 100;
let gameOver =false;
let score =0;
let distance =0;
let combo = 0;
document.addEventListener("keydown",function(event)
{
    if(event.code==="KeyR"&& gameOver)
    {
        restartGame();
    }
    if(event.code === "Space") 
    {
        event.preventDefault();
        if(player.jumps<2 && !gameOver)
        {
            player.velocityY = player.jumpStrength;
            player.onGround = false;
            player.jumps++;
            createJumpParticles();
        }    
    }
});
function updatePlayer() {
    player.velocityY += player.gravity;
    player.y += player.velocityY;
    if(player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.velocityY = 0;
        player.onGround = true;
        player.jumps =0;
    }
    distance += 0.1;
    score +=0.1;
}
function spawnObstacle()
{
    const height = Math.random()* 20 +25;
    const width = Math.random()*15+20;
    const obstacle= {
        x: canvas.width,
        y: groundY -height,
        width: width,
        height : height,
        passed: false
    };
    obstacles.push(obstacle);
}
function spawnCoin(){
    const coin={
        x: canvas.width,
        y: groundY -100 - Math.random()*60,
        radius: 10,
    };
    coins.push(coin);
}
function updateCoins() {
    coinSpawnTimer ++ ;
    if(coinSpawnTimer >=150) {
        spawnCoin();
        coinSpawnTimer =0;
    }
    for(let i= coins.length -1; i>=0;i--) {
        coins[i].x -= obstacleSpeed;
        if(coins[i].x+coins[i].radius<0)
        {
            coins.splice(i,1);
        }
    }
}
function drawCoins() {
    coins.forEach(function(coin) {
        ctx.beginPath();
        ctx.arc(
            coin.x,
            coin.y,
            coin.radius,
            0,
            Math.PI*2

        );
        ctx.fillStyle = "#ffff00";
        ctx.shadowColor = "#ffff00";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur=0;
    });
}
function createJumpParticles(){
    for(let i=0;i<8;i++) {
        particles.push({
            x: player.x + player.width/2,
            y:player.y + player.height,
            velocityX: Math.random()*4-2,
            velocityY:Math.random()*3,
            left:20,
            size:Math.random() *4+2
        });

    }
}
function updateParticles(){
    for(let i=particles.length -1;i>=0;i--){
        let p= particles[i];
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.velocityY+=0.2;
        p.left--;
        if(p.left <=0) {
            particles.splice(i,1);
        }
    }
}
function drawParticles(){
    particles.forEach(function(p){
        ctx.fillStyle = "#00ffff";
        ctx.shadowColor = "#00ffff";
        ctx.globalAlpha = p.left /20;
        ctx.fillRect(p.x,p.y,p.size,p.size);

    });
    ctx.globalAlpha =1;
    ctx.shadowBlur =0;
}
function updateObstacles() {
    spawnTimer++;
    if(spawnTimer >= spawnInterval) {
        spawnObstacle();
        spawnTimer=0;
    }
    for(let i= obstacles.length -1; i>=0;i--){
        obstacles[i].x -= obstacleSpeed;

        if(checkCollision(player, obstacles[i])) {
            gameOver = true;
        }
        if(
            !obstacles[i].passed &&
            obstacles[i].x + obstacles[i].width<player.x
        ){
            obstacles[i].passed = true;
            score += 100;
            combo++;
        }
        if(obstacles[i].x + obstacles[i].width <0){
            obstacles.splice(i,1);
        }
    }
}
function checkCollision(player,obstacle) {
    return (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y<obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    );
}
function drawGround() {
    ctx.fillStyle = "#15152b";
    ctx.fillRect(0,340,canvas.width,60);
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(0,338,canvas.width,3);
}
function drawPlayer(){
    ctx.fillStyle = "#00ffff";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur =20;
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
    ctx.shadowBlur =0;
}
function drawObstacles(){
    obstacles.forEach(function(obstacle){
        ctx.fillStyle= "#ff00ff";
        ctx.shadowColor="#ff00ff";
        ctx.shadowBlur=15;
        ctx.fillRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );
        ctx.shadowBlur=0;
    });
}
function drawStats(){
    ctx.shadowBlur=0;
    ctx.fillStyle= "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: "+Math.floor(score),10,20);
    ctx.fillText("Distance:"+Math.floor(distance)+"m",20,55);
    ctx.fillText("Combo: "+combo,20,80);
}
function drawGame() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGround();
    drawPlayer();
    drawObstacles();
    drawParticles();
    drawCoins();
    drawStats();
}
function drawGameOver() {
    ctx.fillStyle ="white";
    ctx.font = "bold 48px Arial";
    ctx.textAlign= "center";
    ctx.fillText(
        "GAME OVER",
        canvas.width/2,
        canvas.height/2
    );
}
function restartGame(){
    gameOver= false;
    player.x=100;
    player.y=290;
    player.velocityY=0;
    player.onGround= false;
    obstacles.length=0;
    spawnTimer =0;
    score=0;
    distance=0;
    combo=0;
    gameLoop();
}
function gameLoop()
{
    if(!gameOver) {
        updatePlayer();
        updateObstacles();
        updateParticles();
        updateCoins();
        drawGame();
        requestAnimationFrame(gameLoop);
    }
    else{
        drawGame();
        drawGameOver();
    }
}
gameLoop();