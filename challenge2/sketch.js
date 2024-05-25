const video = document.createElement('video');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 480;

let model, videoWidth, videoHeight;
let characterX = canvas.width / 2;
let characterY = canvas.height / 2;

// Load PoseNet
async function setupCamera() {
    video.width = canvas.width;
    video.height = canvas.height;

    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadPosenet() {
    model = await posenet.load();
}

async function detectPose() {
    const pose = await model.estimateSinglePose(video, {
        flipHorizontal: true, // Horizontaal spiegelen
    });
    
    const nose = pose.keypoints.find(point => point.part === 'nose');

    if (nose.score > 0.5) {
        characterX = (nose.position.x / videoWidth) * canvas.width;
        characterY = (nose.position.y / videoHeight) * canvas.height;
    }

    draw();
    requestAnimationFrame(detectPose);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(characterX - 25, characterY - 25, 50, 50);
}

async function init() {
    await setupCamera();
    video.play();

    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;

    await loadPosenet();
    detectPose();
}

init();
