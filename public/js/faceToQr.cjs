document.getElementById('generate-qr-btn').addEventListener('click', function () {
    const dataStr = document.getElementById('descriptor-data').textContent;

    if (dataStr) {
        const descriptorArray = dataStr.split(',').map(parseFloat);
        const descriptorFloat32Array = new Float32Array(descriptorArray);
        const byteArray = new Uint8Array(descriptorFloat32Array.buffer);

        // Convert binary data to a Base64 string
        const base64String = btoa(String.fromCharCode.apply(null, byteArray));

        console.warn("descriptorArray", descriptorArray)
        console.warn("descriptorFloat32Array", descriptorFloat32Array)
        console.warn("BASE 64", base64String)

        // Generate the QR code
        QRCode.toCanvas(document.getElementById('qr-canvas'), base64String, {
            errorCorrectionLevel: 'M',
            scale: 3
        }, function (error) {
            if (error) console.error('Error generating QR code:', error);
            else {
                console.log('QR Code generated!');
                downloadGeneratedQrCode()
            }
        });
    } else {
        console.error('Descriptor data is empty');
    }
});

function downloadGeneratedQrCode() {
    // Create a download link for the QR code image
    const canvas = document.getElementById('qr-canvas');
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = `QRCode_${Date.now()}.png`; // Set the name of the download file
    document.body.appendChild(downloadLink);
    downloadLink.click();  // Trigger the download
    document.body.removeChild(downloadLink);  // Clean up
}

// READ QR
document.getElementById('qr-file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.getElementById('qr-canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    console.log('QR Code data:', code.data);

                    // Convert Base64 to binary
                    const binaryString = atob(code.data);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }

                    // Convert binary data to Float32Array
                    const descriptorArray = new Float32Array(bytes.buffer);
                    console.log('Descriptor Float32Array:', descriptorArray);
                } else {
                    console.error('No QR code found.');
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('read-qr-btn').addEventListener('click', function () {
    document.getElementById('qr-file-input').click();
});