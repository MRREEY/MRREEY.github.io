import { VegaScatterplot } from "./libraries/vegascatterplot.js";

let carsDataSet;
// let fakeData = createFakedata();
let plot;
let options;
let nn

//
// teken de scatterplot voor de fake data
//
async function drawScatterPlot(data) {
  carsDataSet = data;
  plot = new VegaScatterplot();
  await plot.initialise("horsepower", "mpg", 600, 400, carsDataSet);

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
  console.log("Model Saved");
  nn.save();
}

function loadData() {
  Papa.parse("./data/cars.csv", {
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
  carsDataSet.sort(() => Math.random() - 0.5);

  for (let row of carsDataSet) {
    nn.addData({ horsepower: row.horsepower }, { mpg: row.mpg });
  }

  nn.normalizeData();
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
    let testCar = { horsepower: i };

    let prediction = await nn.predict(testCar);

    predictions.push({
      mpg: prediction[0].mpg,
      horsepower: i,
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
