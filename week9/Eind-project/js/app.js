const video = document.getElementById("webcam");
const label = document.getElementById("label");

const modelURL = URL + "./my_model/model.json";
const metadataURL = URL + "./my_model/metadata.json";

let poses =[]

// Create a new poseNet method
const poseNet = ml5.poseNet(video, modelLoaded);
poseNet.on('pose', gotPoses);

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
  poseNet.singlePose(video);
  poseNet.on('pose', (results) => {
    // do something with the results
    console.log(results);
});

}

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject = stream;
    video.play();
  });
}

function gotPoses(results) {
  poses = results
}

