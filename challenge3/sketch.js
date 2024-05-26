let video;
let classifier;
let canvas;
let context;
let modelLoaded = false;

window.addEventListener('load', () => {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error('Error accessing the camera', err);
    });

  classifier = ml5.imageClassifier('MobileNet', () => {
    console.log('R2-D2 Loaded!');
    modelLoaded = true;
    document.querySelector('h1').innerText = "R2-D2 is ready";
  });

  document.getElementById('capture').addEventListener('click', captureAndClassify);
});

function captureAndClassify() {
  if (!modelLoaded) return;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  classifier.classify(canvas, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    results.forEach(result => {
      const confidence = (result.confidence * 100).toFixed(2);
      resultsContainer.innerHTML += `<p>${result.label} - ${confidence}%</p>`;
    });
  });
}
