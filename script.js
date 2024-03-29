let video = document.querySelector("video");
let RecordBtnCont = document.querySelector(".record-btn-cont");
let RecordBtn = document.querySelector(".record-btn");
let CaptureBtnCont = document.querySelector(".capture-btn-cont");
let CaptureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";

let recordFlag = false;
let chunks = []; // Media data in chunks

let recorder;

let constraints = {
  video: true, // If we want video then make it as true
  audio: true, // If we want audio then make it as true
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);

  recorder.addEventListener("start", (e) => {
    chunks = [];
  });

  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });

  recorder.addEventListener("stop", (e) => {
    // conversion of media chunks data to video
    let blob = new Blob(chunks, { type: "video/mp4" });

    if (db) {
      let videoID = shortid(); // it will create a unique id
      let dbTransaction = db.transaction("video", "readwrite");
      let videoStore = dbTransaction.objectStore("video");
      let videoEntry = {
        id: `vid - ${videoID}`,
        blobData: blob,
      };
      videoStore.add(videoEntry);
    }
  });
});

RecordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;

  recordFlag = !recordFlag;

  if (recordFlag) {
    // start
    recorder.start();
    RecordBtn.classList.add("scale-record");

    startTimer();
  } else {
    // stop
    recorder.stop();
    RecordBtn.classList.remove("scale-record");
    stopTimer();
  }
});

CaptureBtnCont.addEventListener("click", (e) => {
  CaptureBtn.classList.add("scale-capture");

  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Filtering

  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);

  let imageURL = canvas.toDataURL();

  if (db) {
    let imageID = shortid(); // it will create a unique id
    let dbTransaction = db.transaction("image", "readwrite");
    let imageStore = dbTransaction.objectStore("image");
    let imageEntry = {
      id: `img - ${imageID}`,
      url: imageURL,
    };
    imageStore.add(imageEntry);
  }

  setTimeout(() => {
    CaptureBtn.classList.remove("scale-capture");
  }, 500);
});

let timerID;
let counter = 0;
let timer = document.querySelector(".timer");

function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalSeconds = counter;

    let hours = Number.parseInt(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600; // remaining value

    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60; // remaining value

    let seconds = totalSeconds;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    timer.innerText = `${hours}: ${minutes} : ${seconds}`;

    counter++;
  }

  timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
  clearInterval(timerID);
  timer.style.display = "none";
  timer.innerText = "00:00:00";
}

// Filtering Logic
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElement) => {
  filterElement.addEventListener("click", (e) => {
    transparentColor =
      getComputedStyle(filterElement).getPropertyValue("background-color"); // Get style property
    filterLayer.style.backgroundColor = transparentColor; // set style property
  });
});
