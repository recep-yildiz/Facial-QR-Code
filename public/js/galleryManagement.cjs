const detectionsContainer = document.getElementById('detections');
let detectionImages = [];

function updateDetectionGallery(img) {
    console.warn(detectionImages.length)

    // temp code for load ind. (shoul be when a frame of camera firstly visible)
    if(detectionImages.length > 0 )
        document.getElementById('loadingIndicator').style.display = 'none';

    detectionImages.unshift(img);
    if (detectionImages.length > 20) detectionImages.pop();
    detectionsContainer.innerHTML = '';
    detectionImages.forEach(image => detectionsContainer.appendChild(image));
}

function shouldAddToGallery(detection) {
    if (!lastDetection) return true;
    const currentBox = detection.detection.box;
    const lastBox = lastDetection.box;
    return Math.abs(currentBox.x - lastBox.x) > movementThreshold ||
        Math.abs(currentBox.y - lastBox.y) > movementThreshold ||
        Math.abs(currentBox.width - lastBox.width) > movementThreshold ||
        Math.abs(currentBox.height - lastBox.height) > movementThreshold;
}


function updateDetectionGalleryFromDetection(detection) {
    const box = detection.detection.box;
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 200;
    faceCanvas.height = 200;
    const faceCtx = faceCanvas.getContext('2d');
    faceCtx.drawImage(
        video,
        box.x,
        box.y - (box.height * 0.4), // Expand the box upwards by 40%
        box.width,
        box.height * 1.3, // Increase height by 30%
        0,
        0,
        faceCanvas.width,
        faceCanvas.height
    );

    const detectionImg = document.createElement('img');
    detectionImg.src = faceCanvas.toDataURL();
    detectionImg.style.objectFit = 'cover';
    detectionImg.className = 'detectionImg';

    
    // Store the descriptor in the image element
    setFaceDescriptor(detectionImg, detection)
    
    updateDetectionGallery(detectionImg);
}

function setFaceDescriptor(detectionImg, detection) {
    detectionImg.dataset.descriptor = detection.descriptor;
}