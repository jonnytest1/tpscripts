import { Frame } from './frame';
import { VidComponent } from './vid.component';


export async function preload(src: string, vid: VidComponent): Promise<{ height: number, width: number, video: HTMLVideoElement }> {
    return new Promise<any>((resolver) => {
        const video = document.createElement('video');

        // document.body.appendChild(video);
        // resolver({ vidData: [], height: 400, width: 800, video });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        video.volume = 0;
        video.src = src;
        video.style.visibility = 'hidden';
        video.playbackRate = 1;
        video.addEventListener('loadeddata', (e) => {
            canvas.style.width = video.videoWidth + 'px';
            canvas.style.height = video.videoHeight + 'px';
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            console.log('loadeddata');
            video.play();
            setTimeout(videoLoop, 20);
        });

        function videoLoop() {
            if (video && !video.paused && !video.ended) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const videodata = context.getImageData(0, 0, canvas.width, canvas.height);
                if (videodata.data.subarray(0, 20).some(d => d !== 0)) {
                    vid.addFrame({
                        time: video.currentTime,
                        data: videodata,
                        adjustements: []
                    });
                }
                if (vid.vidData.length === 2) {
                    resolver({ width: canvas.width, height: canvas.height, video });
                }
                setTimeout(videoLoop, 0);
            }
        }
    });

}

