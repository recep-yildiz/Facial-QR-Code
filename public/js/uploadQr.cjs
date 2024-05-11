document.getElementById('upload-qr-btn').addEventListener('click', function () {
    // Create a file input dynamically
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = e => {
        let file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (event) {
                let img = new Image();
                img.onload = function () {
                    let canvas = document.getElementById('popup-canvas');
                    let context = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);

                    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    let code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code && code.data) {
                        let descriptorFromQR = decodeDescriptorFromQR(code.data);
                        let selectedDescriptor = getSelectedDescriptor(); // Assume this function retrieves the descriptor from the selected face in the gallery

                        let similarityScore = calculateSimilarityScore(descriptorFromQR, selectedDescriptor);
                        displaySimilarityScore(similarityScore); // Display the similarity score somewhere on the page
                    } else {
                        alert('No valid QR code found.');
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    fileInput.click(); // Trigger the hidden file input click event
});

function getSelectedDescriptor() {
    console.warn("DATASET", currentDescriptor)

    const descriptorArray = currentDescriptor.split(',').map(parseFloat);
    const descriptorFloat32Array = new Float32Array(descriptorArray);

    return descriptorFloat32Array;
}

function decodeDescriptorFromQR(base64String) {
    // Decode the Base64 string to binary data
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    // Convert binary data to Float32Array
    return new Float32Array(bytes.buffer);
}

function calculateSimilarityScore(descriptor1, descriptor2) {
    // Placeholder for similarity calculation logic
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    const similarity = (1 - distance) * 100; // Convert to percentage
    return similarity
}

function displaySimilarityScore(score) {
    console.log('Similarity Score:', score);
    // Update the UI to display the similarity score

    const similarityScoreDisplay = document.getElementById('similarity-score');
    similarityScoreDisplay.textContent = `Similarity: ${score.toFixed(2)}%`;
}
