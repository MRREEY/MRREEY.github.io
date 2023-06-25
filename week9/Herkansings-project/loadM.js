const options = { task: 'regression', debug: true }
const nn = ml5.neuralNetwork(options)

nn.load('model/model.json', () => loaded())

function loaded(){
    let predictButton = document.getElementById("predict")
    predictButton.onclick = function() {predictScores()};
}

async function predictScores(){
    let pk = { Hours: parseFloat(document.getElementById("Hours").value)}
    let prediction = await nn.predict(pk)
    prediction.push({
        Hours: pk.Hours,
        Scores: prediction[0].Scores
    })

    let h2 = document.createElement("h3")
    h2.innerHTML = "Learning "+ prediction[1].Hours + " hours means you get an average score of "+ Math.round(prediction[1].Scores)+ "."
    document.body.appendChild(h2)
}