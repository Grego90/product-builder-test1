const MODEL_URL = "https://teachablemachine.withgoogle.com/models/hXnzNfRsDf/";

let model;
let webcam;
let maxPredictions = 0;
let labelContainer;
let lastSource = "";

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const uploadInput = document.getElementById("image-upload");
const webcamContainer = document.getElementById("webcam-container");
const statusEl = document.getElementById("status");

function setStatus(message) {
    statusEl.textContent = message;
}

async function loadModel() {
    if (model) return;
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i += 1) {
        const row = document.createElement("div");
        row.className = "label-row";
        row.innerHTML = `
            <div class="label-name"></div>
            <div class="bar"><span></span></div>
        `;
        labelContainer.appendChild(row);
    }
}

async function initWebcam() {
    await loadModel();
    const flip = true;
    webcam = new tmImage.Webcam(230, 230, flip);
    await webcam.setup();
    await webcam.play();
    webcamContainer.innerHTML = "";
    webcamContainer.appendChild(webcam.canvas);
    lastSource = "webcam";
    startBtn.disabled = true;
    stopBtn.disabled = false;
    setStatus("웹캠 분석 중입니다...");
    window.requestAnimationFrame(webcamLoop);
}

async function webcamLoop() {
    if (!webcam || !lastSource || lastSource !== "webcam") return;
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(webcamLoop);
}

async function stopWebcam() {
    if (webcam) {
        webcam.stop();
        webcam = null;
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
    setStatus("웹캠을 중지했습니다. 사진 업로드 또는 다시 시작하세요.");
}

async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    await loadModel();
    const img = document.createElement("img");
    img.alt = "업로드 이미지";
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
        if (webcam) {
            webcam.stop();
            webcam = null;
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
        webcamContainer.innerHTML = "";
        webcamContainer.appendChild(img);
        lastSource = "upload";
        setStatus("업로드 이미지 분석 완료");
        await predict(img);
        URL.revokeObjectURL(img.src);
    };
}

async function predict(source) {
    if (!model) return;
    const prediction = await model.predict(source);
    prediction.sort((a, b) => b.probability - a.probability);

    prediction.forEach((item, index) => {
        const row = labelContainer.children[index];
        if (!row) return;
        const nameEl = row.querySelector(".label-name");
        const barEl = row.querySelector(".bar span");
        nameEl.textContent = `${item.className} : ${(item.probability * 100).toFixed(1)}%`;
        barEl.style.width = `${Math.round(item.probability * 100)}%`;
    });
}

startBtn.addEventListener("click", () => {
    initWebcam().catch((error) => {
        console.error(error);
        setStatus("웹캠을 시작할 수 없습니다. 브라우저 권한을 확인해주세요.");
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });
});

stopBtn.addEventListener("click", () => {
    stopWebcam();
});

uploadInput.addEventListener("change", handleUpload);

setStatus("모델을 준비 중입니다. 웹캠 시작 또는 사진 업로드를 눌러주세요.");
