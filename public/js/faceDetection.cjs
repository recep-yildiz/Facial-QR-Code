const canvas = document.getElementById('canvas');
const captureCanvas = document.getElementById('captureCanvas');
const captureContext = captureCanvas.getContext('2d');

let lastDetection = null;
const movementThreshold = 15;

video.addEventListener('play', () => {
    const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        captureContext.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            .withFaceDescriptors();

        detections.forEach(detection => {
            if (shouldAddToGallery(detection)) {
                updateDetectionGalleryFromDetection(detection);
                lastDetection = {
                    box: detection.detection.box,
                    landmarks: detection.landmarks.positions
                };
            }
        });

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        resizedDetections.forEach(detection => {
            faceapi.draw.drawDetections(canvas, [detection]);
            faceapi.draw.drawFaceLandmarks(canvas, [detection]);
            faceapi.draw.drawFaceExpressions(canvas, [detection]);
        });
    }, 100);
});
