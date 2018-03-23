# Raspberry Pi Photo Camera
A Node.js module for taking images with the Raspberry Pi Official camera

## Installation
```sh
npm install --save raspberry-pi-photo-camera
```

## Usage

### JavaScript
```javascript
const camera = require('raspberry-pi-photo-camera');

camera.takePicture('helloPictureWorld')
  .then(() => {
    // Image file 'helloPictureWorld.jpg' saved
  })
  .catch(() => {
    // Error while taking picture
  });
```

### TypeScript
```typescript
import * as camera from 'raspberry-pi-photo-camera';

camera.takePicture('helloPictureWorld')
  .then(() => {
    // Image file 'helloPictureWorld.jpg' saved
  })
  .catch(() => {
    // Error while taking picture
  });
```

## Test
```sh
npm run test
```