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

    }catch(error){
        console.log(error);
    }
});