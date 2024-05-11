
# Facial QR Code Project

![face1 (1)](https://github.com/recep-yildiz/Facial-QR-Code/assets/16324956/3df6e690-e238-4f3e-bd7b-e1cd0ac0016e)


## Overview
This project integrates [face-api.js](https://github.com/justadudewhohacks/face-api.js) with QR code generation and basic reading of QR codes to create a simple web application that aims using biometric verification without any database storage. 

The project uses webcams to detect faces in real time and create a simple face gallery. A QR code can be created for any of the faces selected from the gallery or two faces can be matched to get a similarity score. 
Creating a QR code from the selected face and matching faces with created QR codes to get similarity scores is also possible. 

## Features
+ Facial Detection, drawing faces with landmarks and boundary boxes
+ Converting a face descriptor to a QR code to store facial data
+ Face matching between two faces or between a face and a QR code to get similarity scores

## Technologies
+ Facial Detection Library [face-api.js](https://github.com/justadudewhohacks/face-api.js)
+ QR Code Libraries [qrcode](https://github.com/soldair/node-qrcode), [jsQR](https://github.com/cozmo/jsQR) for QR code generation and scanning

# Getting Started
## Prerequisites
+ Node.js installed on your machine
+ A modern web browser that supports ES Modules and HTML5
+ A webcam connected to your machine

## Installation
1. **Clone the repository**
```bash
   git clone https://github.com/recep-yildiz/Facial-QR-Code.git
```

2. **Install Dependencies**
```bash
   npm install
```
 
3. **Build the project**
```bash
   npm start
```

## Usage
+ **Test the project:** If one or more webcams are connected to your machine, the application will choose the primary one and start to detect faces. See the detected faces getting listed into the gallery below the webcam feed
+ **Choose face and generate QR code:** When a face from the gallery is selected, a popup window will appear. From the popup window, QR code can be generated for selected face
+ **Match faces:** An image that contains face or a generated QR code can be uploaded from the popup and see the result of similarity score 

## Licenses
This project is licensed under the MIT License - see the LICENSE file for details
