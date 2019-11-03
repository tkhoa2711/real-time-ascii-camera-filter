const video = document.querySelector('#camera-stream');

// To extract the video frame data, we have to first draw it onto a canvas.
// Only then can we extract pixel data from the canvas context, manipulate it,
// and draw it onto another canvas.
const hiddenCanvas = document.querySelector('#hidden-canvas');
const outputCanvas = document.querySelector('#output-canvas');
const hiddenContext = hiddenCanvas.getContext('2d');
const outputContext = outputCanvas.getContext('2d');

const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&()/\\+<>';

const constraints = {
  video: {
    width: 512,
    height: 512,
  },
};

const getAverageRGB = (frame) => {
  const length = frame.data.length / 4;

  let r = 0;
  let g = 0;
  let b = 0;

  for (let i = 0; i < length; i++) {
    r += frame.data[i * 4 + 0];
    g += frame.data[i * 4 + 1];
    b += frame.data[i * 4 + 2];
  }

  return {
    r: r / length,
    g: g / length,
    b: b / length,
  };
};

const processFrame = () => {
  const fontHeight = 12;
  const { videoWidth: width, videoHeight: height } = video;

  if (width && height) {
    // setup canvases' size
    hiddenCanvas.width = width;
    hiddenCanvas.height = height;
    outputCanvas.width = width;
    outputCanvas.height = height;

    // get frame from hiddenContext
    hiddenContext.drawImage(video, 0, 0, width, height);

    // NOTE: we choose Consolas because it's a monospace font
    // and to avoid varible character width, which makes calculation difficult
    outputContext.textBaseline = 'top';
    outputContext.font = `${fontHeight}px Consolas`;

    const text = outputContext.measureText('@');
    const fontWidth = parseInt(text.width);

    // draw outputContext
    outputContext.clearRect(0, 0, width, height);

    for (let y = 0; y < height; y += fontHeight) {
      for (let x = 0; x < width; x += fontWidth) {
        const frameSection = hiddenContext.getImageData(x, y, fontWidth, fontHeight);
        const { r, g, b } = getAverageRGB(frameSection);
        const randomCharacter = charset[Math.floor(Math.random() * charset.length)];

        // apply filter
        outputContext.fillStyle = `rgb(${r},${g},${b})`;
        outputContext.fillText(randomCharacter, x, y);
      }
    }
  }

  window.requestAnimationFrame(processFrame);
};

navigator.getUserMedia(
  constraints,
  stream => {
    video.srcObject = stream;
    video.play();
  },
  console.error
);

video.addEventListener('play', function () {
  window.requestAnimationFrame(processFrame);
  console.log('Live!');
});
