let video;
let poseNet;
let poses = [];
let characterX, characterY;
let obstacles = [];
let bulletPool = [];
let lastBulletTime = 0;
let fireRate = 1000;
let score = 0;
let level = 1;
let lives = 3;
let obstacleInterval = 2000;
let lastObstacleTime = 0;
let rebelBaseImg;
let characterImg;
const maxBullets = 50;
const bulletSpeed = 5;
const obstacleSpeed = 3;

let startSound, winSound, loseSound;

function preload() {
    rebelBaseImg = loadImage('./images/rebelbase.webp');
    startSound = loadSound('./sounds/start.mp3', soundLoaded);
    winSound = loadSound('./sounds/victory.mp3', soundLoaded);
    loseSound = loadSound('./sounds/lose.mp3');
    characterImg = loadImage('./images/x.png');
}

function soundLoaded() {
    console.log("Sounds loaded successfully.");
}

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    video = createCapture(VIDEO);
    video.size(windowWidth, windowHeight);
    video.hide();

    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', function (results) {
        poses = results;
    });

    characterX = width / 2;
    characterY = height / 2;

    for (let i = 0; i < maxBullets; i++) {
        bulletPool.push(new Bullet());
    }

    document.getElementById('start-screen').style.display = 'flex';
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function modelReady() {
    console.log('Model Loaded');
}

function startGame() {
    console.log("Start button pressed.");
    stopAllSounds();
    startSound.play();
    document.getElementById('start-screen').style.display = 'none';
    setInterval(addObstacle, obstacleInterval);
    requestAnimationFrame(updateGame);
}

function updateGame() {
    if (level >= 25) {
        winGame();
        return;
    }

    background(0);

    if (poses.length > 0) {
        let head = poses[0].pose.keypoints.find(point => point.part === 'nose');

        if (head.score > 0.5) {
            characterX = (head.position.x / video.width) * width;
            characterY = (head.position.y / video.height) * height;

            if (characterY < height / 2 && millis() - lastBulletTime > fireRate) {
                fireBullet();
                lastBulletTime = millis();
            }
        }
    }

    image(characterImg, characterX - 50, characterY - 50, 100, 100);

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obstacle = obstacles[i];
        obstacle.update();
        obstacle.show();

        for (let j = bulletPool.length - 1; j >= 0; j--) {
            let bullet = bulletPool[j];
            if (bullet.active) {
                bullet.update();
                bullet.show();
                if (bullet.hits(obstacle)) {
                    bullet.deactivate();
                    obstacles.splice(i, 1);
                    score++;
                    break;
                }
            }
        }

        if (obstacle.hits(characterX, characterY)) {
            lives--;
            obstacles.splice(i, 1);
            if (lives <= 0) {
                gameOver();
                return;
            }
        }
    }

    bulletPool.forEach(bullet => {
        if (bullet.active) {
            bullet.update();
            bullet.show();
        }
    });

    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('lives').innerText = `Lives: ${lives}`;
    document.getElementById('level').innerText = `Level: ${level}`;

    requestAnimationFrame(updateGame);
}

function gameOver() {
    stopAllSounds();
    loseSound.play();
    document.getElementById('game-over-screen').style.display = 'flex';
}

function winGame() {
    stopAllSounds();
    winSound.play();
    background(0);
    image(rebelBaseImg, 0, 0, windowWidth, windowHeight);
    document.getElementById('win-screen').style.display = 'flex';
}

function addObstacle() {
    obstacles.push(new Obstacle());
}

function fireBullet() {
    let bullet = bulletPool.find(b => !b.active);
    if (bullet) {
        bullet.activate(characterX, characterY);
    }
}

class Obstacle {
    constructor() {
        this.x = random(width);
        this.y = random(-height, 0);
        this.size = random(30, 50);
        this.speed = obstacleSpeed;
    }

    update() {
        this.y += this.speed;

        if (this.y > height) {
            this.y = random(-height, 0);
            this.x = random(width);
            score++;

            if (score % 5 === 0) {
                level++;
                let additionalObstacles = level * 0.05;

                if (additionalObstacles >= 1) {
                    for (let i = 0; i < Math.floor(additionalObstacles); i++) {
                        obstacles.push(new Obstacle());
                    }
                }

                if (random(1) < additionalObstacles % 1) {
                    obstacles.push(new Obstacle());
                }

                for (let obstacle of obstacles) {
                    obstacle.speed += 0.05;
                }
            }
        }
    }

    show() {
        fill(200);
        ellipse(this.x, this.y, this.size);
    }

    hits(px, py) {
        let d = dist(this.x, this.y, px, py);
        return (d < this.size / 2 + 25);
    }
}

class Bullet {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 5;
        this.speed = bulletSpeed;
        this.active = false;
    }

    activate(x, y) {
        this.x = x;
        this.y = y;
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

    update() {
        this.y -= this.speed;
        if (this.y < 0) {
            this.deactivate();
        }
    }

    show() {
        fill(0, 255, 0);
        ellipse(this.x, this.y, this.size);
    }

    hits(obstacle) {
        let d = dist(this.x, this.y, obstacle.x, obstacle.y);
        return (d < this.size / 2 + obstacle.size / 2);
    }
}

function restartGame() {
    score = 0;
    level = 1;
    lives = 3;
    obstacles = [];
    bulletPool.forEach(bullet => bullet.deactivate());
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('win-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}

function stopAllSounds() {
    if (startSound.isPlaying()) startSound.stop();
    if (winSound.isPlaying()) winSound.stop(); 
    if (loseSound.isPlaying()) loseSound.stop();
    }
    
    function showHowToPlay() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('how-to-play-screen').style.display = 'flex';
    }
    
    function hideHowToPlay() {
    document.getElementById('how-to-play-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    }