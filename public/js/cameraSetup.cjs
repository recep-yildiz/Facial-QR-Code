const video = document.getElementById('video');
const cameraSelect = document.getElementById('cameraSelect');

async function startVideo(stream) {
    document.getElementById('loadingIndicator').style.display = 'block';
    video.srcObject = stream;
    video.play();
}

async function getCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    cameraSelect.innerHTML = videoDevices.map((device, index) => {
        const label = device.label || `Camera ${index + 1}`;
        return `<option value="${device.deviceId}">${label}</option>`;
    }).join('');
    if (videoDevices.length > 0) {
        await changeCamera(videoDevices[0].deviceId);
    }
}

async function changeCamera(deviceId) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined }
    });
    startVideo(stream);
}

cameraSelect.addEventListener('change', () => {
    changeCamera(cameraSelect.value);
});

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(getCameras);


// Make sure to handle the case where the camera is not available or user denies the camera access
navigator.mediaDevices.getUserMedia({ video: {} })
    .then((startVideo) => {
        document.getElementById('loadingIndicator').style.display = 'none';
    })
    .catch(e => {
        console.error('Error accessing webcam', e);
        document.getElementById('loadingIndicator').style.display = 'block';
        alert('Error accessing the webcam.');
    });