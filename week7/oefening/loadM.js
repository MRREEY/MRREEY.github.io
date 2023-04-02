const options = { task: 'regression', debug: true }
const nn = ml5.neuralNetwork(options)

const modelInfo = {
    model: './model/model.json',
    metadata: './model/model_meta.json',
    weights: './model/model.weights.bin',
};

nn.load(modelInfo, loaded);

function loaded(){
    let predictButton = document.getElementById("predict")
    predictButton.onclick = function() {predictMPG()};
}

async function predictMPG(){
    let pk = { horsepower: parseFloat(document.getElementById("horsepower").value)}
    let prediction = await nn.predict(pk)
    prediction.push({
        horsepower: pk.horsepower,
        mpg: prediction[0].mpg
    })

    let h2 = document.createElement("h2")
    h2.innerHTML = "Having a horsepower of "+ prediction[1].horsepower + "pk means a mpg of "+ Math.round(prediction[1].mpg)+ " miles per gallon."
    document.body.appendChild(h2)
}