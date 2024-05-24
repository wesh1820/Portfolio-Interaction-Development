let targets = [];
let score = 0;
let timer = 30; // in seconds
let gameOver = false;
let video;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide(); // Hide the video element
  initializeTargets();
  setInterval(decreaseTimer, 1000); // Decrease timer every second
}

function draw() {
  background(220);
  push(); // Save the current drawing style
  translate(width, 0); // Move the origin to the top-right corner
  scale(-1, 1); // Mirror horizontally
  image(video, 0, 0, width, height); // Display the mirrored video feed
  pop(); // Restore the previous drawing style
  
  if (!gameOver) {
    // Display targets
    for (let i = 0; i < targets.length; i++) {
      targets[i].display();
    }

    // Display score
    fill(0);
    textSize(24);
    textAlign(RIGHT);
    text(`Score: ${score}`, width - 20, 30);

    // Display timer
    text(`Time: ${timer}`, width - 20, 60);

    // Check for game over
    if (timer <= 0) {
      gameOver = true;
      textSize(36);
      fill(255, 0, 0);
      textAlign(CENTER);
      text("Game Over", width / 2, height / 2);
      textSize(24);
      fill(0);
      text(`Final Score: ${score}`, width / 2, height / 2 + 50);
    }
  }
}

function initializeTargets() {
  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);
    targets.push(new Target(x, y, 50));
  }
}

function mousePressed() {
  // Check if mouse click hits any target
  if (!gameOver) {
    let handDetected = false;
    // Iterate through each target
    for (let i = targets.length - 1; i >= 0; i--) {
      if (targets[i].hitWithinRegion(palmX, palmY)) { // Assuming palmX and palmY represent the coordinates of the fist
        score++;
        targets.splice(i, 1); // Remove the target
        handDetected = true;
        break; // Exit loop after hitting one target
      }
    }
    if (!handDetected) {
      // Penalty for missing the target
      score--;
    }
  }
}

function decreaseTimer() {
  if (!gameOver) {
    timer--;
  }
}

class Target {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  
  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  hitWithinRegion(x, y) {
    // Check if the given coordinates are within the region of the target
    let d = dist(x, y, this.x, this.y);
    return d < this.size / 2;
  }
}
