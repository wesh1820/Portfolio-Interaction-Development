let objectDetector;

let img;
let objects = [];
let modelLoaded;

function preload() {
  img = loadImage('images/bike.jpg');
}


function setup() {
  createCanvas(640, 420);
  objectDetector = ml5.objectDetector('cocossd', modelReady);
}
document.querySelector("#btn-detect").addEventListener(
  'click',
  () => objectDetector.detect(img, gotResult)
);

function modelReady() {
  modelLoaded = true;
  document.querySelector("#model-feedback").style.display = "none";
  document.querySelector("#btn-detect").style.display = "inline-block";
  // objectDetector.detect(img, gotResult);
}

function gotResult(err, results) {
  if (err) {
    console.log(err);
  }
  console.log(results)
  objects = results;
}


function draw() {
  // enkel tekenen als model geladen werd
  image(img, 0, 0);
  if (modelLoaded) {
    //teken groene kader rond elk gevonden object
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].confidence > 0.5) {

        noStroke();
        fill(0, 208, 133);
        // textSize(8);
        text(objects[i].label + " " + nfc(objects[i].confidence * 100.0, 2) + "%", objects[i].x + 8, objects[i].y + 12);
        noFill();
        strokeWeight(4);
        stroke(0, 208, 133);
        rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
      }
    }
  }
}