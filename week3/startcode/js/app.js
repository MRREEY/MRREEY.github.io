const video = document.getElementById("webcam");
const label = document.getElementById("label");

const labelOneBtn = document.querySelector("#labelOne");
const labelTwoBtn = document.querySelector("#labelTwo");
const voorspel = document.querySelector("#voorspel");
const trainbtn = document.querySelector("#train");

const amountOfSteenimages = document.getElementById("amountOfSteenImages");
const amountOfPapierimages = document.getElementById("amountOfPapierImages");

const train = document.getElementById("train");
const save = document.getElementById("save");
const loss = document.getElementById("loss");

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
  classifier.load('./my_model/model.json', customModelReady);
  speak(label.innerHTML)
}

function customModelReady() {
  console.log('Custom model is ready')
}

// Create a new classifier using those features and with a video element
const classifier = featureExtractor.classification(video, videoReady);

// Triggers when the video is ready
function videoReady() {
  console.log('De video is klaar!');
}

//testing speech
let synth = window.speechSynthesis

function speak(text) {
    if (synth.speaking) {
        console.log('Blijft praten....')
        return
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text)
        synth.speak(utterThis)
    }
}

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.log("Camera kapot...");
        });
}

//maakt foto's die getraind kunnen worden en geeft het aantal foto's met 
//naam
labelOneBtn.onclick = function() {
    classifier.addImage(video, "steen");
    amountOfSteenimages.innerText = Number(amountOfSteenimages.innerText) + 1;
  };

labelTwoBtn.onclick = function() {
    classifier.addImage(video, "papier");
    amountOfPapierimages.innerText = Number(amountOfPapierimages.innerText) + 1;
  };

  train.onclick = function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        totalLoss = lossValue;
        loss.innerHTML = `Loss: ${totalLoss}`;
      } else {
        loss.innerHTML = `Done Training! Final Loss: ${totalLoss}`;
      } 
    });
  };

  save.onclick = function() {
    classifier.save();
  };

voorspel.onclick = function() {
  featureExtractor.classify(gotVoorspelling);
}

// Show the results
function gotVoorspelling(err, voorspellingen) {
  // Display any error
  if (err) {
    console.error(err);
  }
  if (voorspellingen && voorspellingen[0]) {
    voorspel.innerText = voorspellingen[0].label;
    confidence.innerText = voorspellingen[0].confidence;
    classifier.classify(gotVoorspelling);
    speak("ik denk dat het:" + voorspel.innerHTML + "is")
  }
}