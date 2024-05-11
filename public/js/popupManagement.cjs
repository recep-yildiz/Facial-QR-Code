const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;

// to compare description values (to delete)
let test1Desc = null;
let test2Desc = null;

document.addEventListener('DOMContentLoaded', function () {

    const overlay = document.getElementById('popup-overlay');
    const popupImage = document.getElementById('popup-image');
    const popupContent = document.getElementById('popup-content');
    const uploadedImage = document.getElementById('uploaded-image');
    const fileInput = document.getElementById('face-upload');
    const similarityScoreDisplay = document.getElementById('similarity-score');

    detectionsContainer.addEventListener('click', function (event) {
        if (event.target.className === 'detectionImg') {
            const descriptorData = event.target.dataset.descriptor;
            currentDescriptor = descriptorData;
            document.getElementById('descriptor-data').textContent = descriptorData; // Assuming you have a paragraph to show the data

            popupImage.src = event.target.src; // Set the source of the popup image
            overlay.style.display = 'block'; // Show the popup overlay
        }
    });

    // Prevent closing popup when interacting with the popup content
    popupContent.addEventListener('click', function (event) {
        event.stopPropagation(); // This stops the click event from propagating to the overlay
    });

    fileInput.addEventListener('change', async function () {
        if (this.files && this.files[0]) {
            const img = await faceapi.bufferToImage(this.files[0]);
            uploadedImage.src = URL.createObjectURL(this.files[0]);

            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            
            //
            drawUploadedImageFace(img, detections)

            console.warn("UPLOADED IMG:", detections)
           
            if (detections) {
                const imgToCompare = await faceapi.fetchImage(popupImage.src);
                const detectionsToCompare = await faceapi.detectSingleFace(imgToCompare).withFaceLandmarks().withFaceDescriptor();
                if (detectionsToCompare) {
                    const distance = faceapi.euclideanDistance(detections.descriptor, detectionsToCompare.descriptor);

                    test2Desc = detectionsToCompare.descriptor // to delete
                    const similarity = (1 - distance) * 100; // Convert to percentage
                    similarityScoreDisplay.textContent = `Similarity: ${similarity.toFixed(2)}%`;

                    console.log("desc1: ", detections.descriptor, "\n\n", "Desc2: ", detectionsToCompare.descriptor)
                    
                } else {
                    similarityScoreDisplay.textContent = "No face detected in popup image.";
                }

            } else {
                similarityScoreDisplay.textContent = "No face detected in uploaded image.";
            }
        }
    });

    overlay.addEventListener('click', function () {
        overlay.style.display = 'none'; // Hide the overlay
    });
});

function drawUploadedImageFace(img, detections) {
    const popupCanvas = document.getElementById('popup-canvas');
    const context = popupCanvas.getContext('2d');

    // Calculate the scale to fit the image within the maximum dimensions
    let scale = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height, 1); // Ensure the scale does not exceed 1
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // Set canvas size to the scaled dimensions
    popupCanvas.width = scaledWidth;
    popupCanvas.height = scaledHeight;

    // Draw the uploaded image onto the canvas
    context.clearRect(0, 0, popupCanvas.width, popupCanvas.height);
    context.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    const faces = Array.isArray(detections) ? detections : (detections ? [detections] : []);

    // Draw face rectangles
    faces.forEach(det => {
        const { x, y, width, height } = det.detection.box;
        context.strokeStyle = '#00ff00';
        context.lineWidth = 2;
        context.strokeRect(x * scale, y * scale, width * scale, height * scale); // Scale the box coordinates too
    });

}

document.getElementById('save-descriptor-btn').addEventListener('click', function () {
    const dataStr = document.getElementById('descriptor-data').textContent;

    if (dataStr) {
        try {
            const descriptorArray = dataStr.split(',').map(parseFloat);
            const descriptorFloat32Array = new Float32Array(descriptorArray);

            // Create a Blob directly from the Float32Array buffer
            const blob = new Blob([descriptorFloat32Array.buffer], { type: "application/octet-stream" });

            if (blob.size > 0) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = "face_descriptor.bin";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Blob is empty:', blob);
            }
        } catch (e) {
            console.error('Error processing descriptor data:', e);
        }
    } else {
        console.error('Descriptor data is empty');
    }
});


document.getElementById('upload-descriptor-btn').addEventListener('click', function () {
    document.getElementById('descriptor-file-input').click();  // Trigger file input
});

document.getElementById('descriptor-file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = function () {
            try {
                // Convert the ArrayBuffer directly to Float32Array
                const buffer = new Uint8Array(reader.result);
                const descriptorFloat32Array = new Float32Array(buffer.buffer);

                console.log("Loaded Float32Array:", descriptorFloat32Array);
                console.log("Length of Float32Array:", descriptorFloat32Array.length);


                // test for descriptor comparization
                test1Desc = descriptorFloat32Array
                console.warn("hehe:", test1Desc, test2Desc)
                compareDescriptors(test1Desc, test2Desc)

            } catch (e) {
                console.error('Error processing the descriptor data:', e);
            }
        };

        reader.onerror = function () {
            console.error('Error reading the file:', reader.error);
        };
    }
});


// To compare two descriptors
function compareDescriptors(desc1, desc2) {
    if (desc1 && desc2) {

        console.log(` Descriptor 1: ${desc1}`);
        console.log(` Descriptor 2: ${desc2}`);

        const distance = faceapi.euclideanDistance(desc1, desc2);
        const similarity = (1 - distance) * 100;
        console.log(`Similarity Score: ${similarity.toFixed(2)}%`);
    } else {
        console.log("One or both descriptors are null or not properly formatted.");
    }
}
