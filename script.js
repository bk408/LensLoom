let video = document.querySelector("video");
let RecordBtnCont = document.querySelector(".record-btn-cont")
let RecordBtn = document.querySelector(".record-btn")
let CaptureBtnCont = document.querySelector(".capture-btn-cont")
let CaptureBtn = document.querySelector(".capture-btn")

let recordFlag = false;
let chunks = []; // Media data in chunks


let recorder;

let constraints = {
    video: true,   // If we want video then make it as true
    audio: true    // If we want audio then make it as true
}

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;

        recorder = new MediaRecorder(stream)

        recorder.addEventListener("start", (e) => {
            chunks = [];
        })

        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })

        recorder.addEventListener("stop", (e) => {
            // conversion of media chunks data to video
            let blob = new Blob(chunks, { type: "video/mp4" })
            let videoURL = URL.createObjectURL(blob);

            let a = document.createElement("a")
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        })
    }) 

RecordBtnCont.addEventListener("click", (e) => {
    if (!recorder) return;

    recordFlag = !recordFlag;

    if (recordFlag) { // start
        recorder.start()
        RecordBtn.classList.add("scale-record")
    } else { // stop
        recorder.stop()
        RecordBtn.classList.remove("scale-record")
    }
    })