import { VegaScatterplot } from "./libraries/vegascatterplot.js";

let scoreDataSet;
// let fakeData = createFakedata();
let plot;
let options;
let nn

//
// teken de scatterplot voor de fake data
//
async function drawScatterPlot(data) {
  scoreDataSet = data;
  plot = new VegaScatterplot();
  await plot.initialise("Hours", "Scores", 600, 400, scoreDataSet);
  createNeuralNetwork();
}

options = { task: "regression", debug: true };
nn = ml5.neuralNetwork(options);

let trainButton = document.getElementById("trainM");
trainButton.onclick = function () {
  begin()};

let saveButton = document.getElementById("saveM");
saveButton.onclick = function () {
  saveM()};

saveButton.style.display = "none";

async function saveM() {
  nn.save();
  console.log("Model Saved");
}

function loadData() {
  Papa.parse("./data/score.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      drawScatterPlot(results.data);
    },
  });
}
//
// maak en train het neural network
//
async function createNeuralNetwork() {
  scoreDataSet.sort(() => Math.random() - 0.5);
  
  for (let row of scoreDataSet) {
    nn.addData({ Hours: row.Hours }, { Scores: row.Scores });
    console.log(row.Scores)
  }
  
  nn.normalizeData();
  console.log('werkt')
  nn.train({ epochs: 20 }, () => finishedTraining());
  
  function finishedTraining() {
    console.log("Finished training!");
    saveButton.style.display = "block";
    trainingFinished();
  }
}

//
// predictions
//
async function trainingFinished() {
  let predictions = [];
  for (let i = 0; i < 400; i++) {
    let testLift = { Hours: i };

    let prediction = await nn.predict(testLift);

    predictions.push({
      Scores: prediction[0].Scores,
      Hours: i,
    });
  }

  console.log("all prediction: " + predictions);
  await plot.addPoints(predictions);

  // stuur nu de hele predictions array naar de scatterplot met "plot.addPoints"
  // ...

  
}
function begin() {
  trainButton.style.display = "none";
  loadData();
}
