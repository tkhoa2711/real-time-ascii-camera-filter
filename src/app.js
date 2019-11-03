const video = document.querySelector('#camera-stream');

// To extract the video frame data, we have to first draw it onto a canvas.
// Only then can we extract pixel data from the canvas context, manipulate it,
// and draw it onto another canvas.
const hiddenCanvas = document.querySelector('#hidden-canvas');
const outputCanvas = document.querySelector('#output-canvas');
const hiddenContext = hiddenCanvas.getContext('2d');
const outputContext = outputCanvas.getContext('2d');

const constraints = {
  video: {
    width: 512,
    height: 512,
  },
};

const processFrame = () => {
  const { videoWidth: width, videoHeight: height } = video;

  if (width && height) {
    hiddenCanvas.width = width;
    hiddenCanvas.height = height;
    outputCanvas.width = width;
    outputCanvas.height = height;
    hiddenContext.drawImage(video, 0, 0, width, height);

    // get frame from hiddenContext
    // apply filter
    // draw outputContext
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
