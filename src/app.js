const video = document.querySelector('#camera-stream');

const constraints = {
  video: {
    width: 512,
    height: 512,
  },
};

navigator.getUserMedia(
  constraints,
  stream => {
    video.srcObject = stream;
    video.play();
  },
  console.error
);
