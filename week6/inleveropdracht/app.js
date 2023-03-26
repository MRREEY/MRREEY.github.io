import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"
const ignoredColumns = []

let poisonous = 0
let notPoisonous = 0
let predictedWrongPoisonous = 0
let predictedWrongNotPoisonous = 0
let decisionTree

// inladen csv data
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => trainModel(results.data)
    })
}

function matrix(poisonous,notPoisonous,predictedWrongPoisonous,predictedWrongNotPoisonous){
    document.getElementById("poisonous").innerHTML = poisonous
    document.getElementById("notPoisonous").innerHTML = notPoisonous
    document.getElementById("predictedWrongPoisonous").innerHTML = predictedWrongPoisonous
    document.getElementById("predictedWrongNotPoisonous").innerHTML = predictedWrongNotPoisonous
}

function predicted(testData){
    let amountCorrect = 0
    let total = testData.length

    for (const testShroom of testData) {
    let shroomWithoutLabel = Object.assign({}, testShroom)
    delete shroomWithoutLabel.class

    // prediction maken
    let prediction = decisionTree.predict(shroomWithoutLabel)

      // Confusion Matrix
    if(prediction == testShroom.class) {
        amountCorrect++

        if(prediction == "e"){
            notPoisonous++
        }

        if(prediction == "p"){
            poisonous++
        }
    } 

    if(prediction == "e" && testShroom.class == "p"){
        predictedWrongNotPoisonous++
    }

    if(prediction == "p" && testShroom.class == "e"){
        predictedWrongPoisonous++
    }
}
matrix(poisonous,notPoisonous,predictedWrongPoisonous,predictedWrongNotPoisonous)

let accuracy = amountCorrect / total
document.getElementById("accuracy").innerHTML = "It's "+ accuracy *100 + "% accurate!"
}

function trainModel(data) {
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

        decisionTree = new DecisionTree({

        ignoredAttributes: ignoredColumns,    
        trainingSet: trainData,    
        categoryAttr: trainingLabel,    
        maxTreeDepth: 20
        })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

        predicted(testData)

        let amountCorrect = 0;
  let total = testData.length;

  for (const testShroom of testData) {
    let shroomWithoutLabel = Object.assign({}, testShroom);
    delete shroomWithoutLabel.class;

    let prediction = decisionTree.predict(shroomWithoutLabel);
    if (prediction == testShroom.class) {
      amountCorrect++;
    }
  }
  let accuracy = (amountCorrect / total) * 100;

  console.log("Het is: " + accuracy + "% accuraat!");
  //accuracy

  //data mushrooms.csv labels
  let shroom = {
    cap_shape: "b",
    cap_surface: "f",
    cap_color: "n",
    bruises: "t",
    odor: "a",
    gill_attachment: "a",
    gill_spacing: "c",
    gill_size: "b",
    gill_color: "k",
    stalk_shape: "e",
    stalk_root: "b",
    stalk_surface_above_ring: "f",
    stalk_surface_below_ring: "f",
    stalk_color_above_ring: "n",
    stalk_color_below_ring: "n",
    veil_type: "p",
    veil_color: "n",
    ring_number: "n",
    ring_type: "c",
    spore_print_color: "k",
    population: "a",
    habitat: "g",
  };

  //predict of shroom eetbaar of poisonous is
  let prediction = decisionTree.predict(shroom);
  //geeft prediction
  console.log(`This shit is ${prediction}`);
    }

loadData()