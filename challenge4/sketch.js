    let permissionGranted = false;
    let deltaX, deltaY;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cellSize = 40;
    const mazeWidth = Math.floor(w / cellSize);
    const mazeHeight = Math.floor(h / cellSize);
    const beginX = Math.floor(mazeWidth / 2) * cellSize;
    const beginY = Math.floor(mazeHeight / 2) * cellSize;
    let maze = [];
    let bolletje = { x: 0, y: 0, size: 20, color: "#000000" };

    let won = false;

    const ballSize = 20;
    const ballColor = "#a4081f";
    let ball;

    function requestMotionPermission() {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              permissionGranted = true;
              showStartScreen();
            } else {
              console.log('Permission for motion sensors denied.');
              alert('Permission for motion sensors denied.');
            }
          })
          .catch(console.error);
      } else {
        console.log('This browser does not support motion sensor permission.');
        alert('This browser does not support motion sensor permission.');
      }
    }

    function showStartScreen() {
      document.getElementById('start-screen').style.display = 'block';
    }

    function startGame() {
      document.getElementById('start-screen').style.display = 'none';
      setup();
      draw();
    }
    
function setup() {
  createCanvas(w, h);
  generateMaze();
  placeBolletje();
  placeBallOnWhiteTile();
  ball = new Ball(ballStartingX, ballStartingY, ballSize, ballColor);
}

function placeBallOnWhiteTile() {

  do {
    ballStartingX = Math.floor(random(1, mazeWidth - 1)) * cellSize;
    ballStartingY = Math.floor(random(1, mazeHeight - 1)) * cellSize;
  } while (maze[Math.floor(ballStartingY / cellSize)][Math.floor(ballStartingX / cellSize)] !== 0 
          || (ballStartingX === bolletje.x && ballStartingY === bolletje.y)); 
}

    

    function draw() {
      background(0, 0, 0);
      drawMaze();
      if (!won) {
        ball.show();
        moveBall();
        checkWinCondition();
      } else {
        document.getElementById('win-screen').style.display = 'block';
      }
      drawBolletje();
    }

    function generateMaze() {

      maze = Array.from({ length: mazeHeight }, () => Array.from({ length: mazeWidth }, () => 1));

      const stack = [{ x: Math.floor(Math.random() * mazeWidth), y: Math.floor(Math.random() * mazeHeight) }];
      while (stack.length > 0) {
        const current = stack.pop();
        const x = current.x;
        const y = current.y;

        if (maze[y][x] === 0) continue; 

        maze[y][x] = 0; 

        const neighbors = [];
        if (x > 1 && maze[y][x - 2] === 1) neighbors.push({ x: x - 2, y });
        if (x < mazeWidth - 2 && maze[y][x + 2] === 1) neighbors.push({ x: x + 2, y });
        if (y > 1 && maze[y - 2][x] === 1) neighbors.push({ x, y: y - 2 });
        if (y < mazeHeight - 2 && maze[y + 2][x] === 1) neighbors.push({ x, y: y + 2 });
        if (neighbors.length > 0) {
          const next = neighbors[Math.floor(Math.random() * neighbors.length)];
          const nx = next.x;
          const ny = next.y;
          maze[(y + ny) / 2][(x + nx) / 2] = 0;
         
          stack.push(current, next);
        }
      }

      placeBolletje();
    }

    function drawMaze() {
      for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
          if (maze[y][x] === 1) {
            fill("#000000"); 
          } else {
            fill("#fff");
          }
          rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    function placeBolletje() {
      let x, y;
      do {
        x = Math.floor(random(1, mazeWidth - 1)) * cellSize;
        y = Math.floor(random(1, mazeHeight - 1)) * cellSize;
      } while (maze[Math.floor(y / cellSize)][Math.floor(x / cellSize)] === 1);
      bolletje.x = x;
      bolletje.y = y;
    }

    function drawBolletje() {
      fill(bolletje.color);
      circle(bolletje.x + cellSize / 2, bolletje.y + cellSize / 2, bolletje.size);
    }

function moveBall() {
  angleMode(DEGREES);
  deltaX = map(rotationX, -30, 30, -5, 5);
  deltaY = map(rotationY, -30, 30, -5, 5);

  let nextX = ball.x + deltaX;
  let nextY = ball.y - deltaY;
  let ballCellX = Math.floor(nextX / cellSize);
  let ballCellY = Math.floor(nextY / cellSize);

  if (ballCellX >= 0 && ballCellX < mazeWidth && ballCellY >= 0 && ballCellY < mazeHeight) {

    if (maze[ballCellY][ballCellX] === 0) {
      ball.move(deltaX, deltaY);
    }
  }
}



    function checkWinCondition() {
      let distance = dist(ball.x, ball.y, bolletje.x + cellSize / 2, bolletje.y + cellSize / 2);
      if (distance < ballSize / 2 + bolletje.size / 2) {
        won = true;
      }
    }

function restartGame() {
  document.getElementById('win-screen').style.display = 'none';
  won = false; 
  setup(); 
  draw(); 
}


    function showInstructions() {
      document.getElementById('instructions-screen').style.display = 'block';
    }

    function hideInstructions() {
      document.getElementById('instructions-screen').style.display = 'none';
    }

    class Ball {
      constructor(x, y, s, c) {
        this.x = x;
        this.y = y;
        this.size = s;
        this.color = c;
      }

      show() {
        push();
        noStroke();
        fill(this.color);
        circle(this.x, this.y, this.size);
        pop();
      }

      move(xOff, yOff) {
        this.x += xOff;
        this.y -= yOff;
        let r = this.size / 2;
        if (this.x - r < 0) {
          this.x = 0 + r;
        }
        if (this.x + r > width) {
          this.x = width - r;
        }
        if (this.y - r < 0) {
          this.y = 0 + r;
        }
        if (this.y + r > height) {
          this.y = height - r;
        }
      }
    }

