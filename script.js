let video = document.querySelector("video");

let constraints = {
    video: true,   // If we want video then make it as true
    Audio: true    // If we want audio then make it as true
}

/*navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;
}) */