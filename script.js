const startSharing = document.getElementById("startSharing");
const videoScreen = document.getElementById("screenVideoShare");

let mediaRecorder;
let recordedChunks = [];

startSharing.addEventListener('click', async () => {
    try{

        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: 'always'
            },
            audio:false
        });

        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio:true
        });

        const combinedStreams = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
        ]);

        videoScreen.srcObject = combinedStreams;

        videoScreen.onloadedmetadata = () =>{
            videoScreen.play();
        }

        combinedStreams.getVideoTracks()[0].onended = () =>{
            stopSharing();
        }

        startRecording(combinedStreams);

    }catch(error){
        console.log(error);
    }
});

function startRecording(mediaStream) {

    mediaRecorder = new MediaRecorder(mediaStream, {mimeType: "video/webm"});

    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.start();

    mediaRecorder.onstop = () => {
        downloadVideo();
    };

}

function stopSharing() {

    if(videoScreen.srcObject){
        videoScreen.srcObject.getTracks().forEach(track => track.stop());
        videoScreen.srcObject = null;
    }

    if(mediaRecorder){
        mediaRecorder.stop();
    }

}

function downloadVideo() {
    const blob = new Blob(recordedChunks, {type: "video/webm"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "video_browser.mp4";
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}