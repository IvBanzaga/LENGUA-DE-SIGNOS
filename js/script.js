
    const URL = "./my_model/";

    let model, webcam, labelContainer, maxPredictions;

    // Cargar el modelo de imagen y configurar la cámara web
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Función de conveniencia para configurar una cámara web
        const flip = true; // si se debe voltear la cámara web
        webcam = new tmImage.Webcam(500, 500, flip); // ancho, alto, voltear
        await webcam.setup(); // solicitar acceso a la cámara web
        await webcam.play();
        window.requestAnimationFrame(loop);


        // agregar elementos al DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // y etiquetas de clase
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // actualizar el cuadro de la cámara web
        await predict();
        window.requestAnimationFrame(loop);
    }

    // ejecutar la imagen de la cámara web a través del modelo de imagen
    async function predict() {
        // predict puede tomar una imagen, video o elemento canvas HTML
        const prediction = await model.predict(webcam.canvas);

        // Encuentra la predicción con la probabilidad más alta
        let maxProbability = 0;
        let bestPrediction = '';

        for (let i = 0; i < maxPredictions; i++) {
            if (prediction[i].probability > maxProbability) {
                maxProbability = prediction[i].probability;
                bestPrediction = prediction[i].className;
            }
        }

        // Mostrar solo la predicción con la probabilidad más alta con estilo
        labelContainer.innerHTML = ''; // Limpiar el contenido anterior
        const bestPredictionElement = document.createElement("div");
        bestPredictionElement.id = "best-prediction";
        bestPredictionElement.textContent = `Predicción: ${bestPrediction} (Probabilidad: ${maxProbability.toFixed(2)})`;
        labelContainer.appendChild(bestPredictionElement);
    }
