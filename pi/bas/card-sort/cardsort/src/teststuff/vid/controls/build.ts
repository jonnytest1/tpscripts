import { VidComponent } from '../vid.component';
import { PausePlay } from './pauseplay';

export class Build extends PausePlay {

    run(c: VidComponent, elementRef: HTMLElement) {
        const button = document.createElement('button');
        button.textContent = 'downlpad';
        button.onclick = () => {
            // super.play(c);
            const finalStream = new MediaStream();

            // @ts-ignore
            c.video.captureStream()
                .getAudioTracks()
                .forEach((track) => {
                    finalStream.addTrack(track);
                });

            // @ts-ignore
            canvas.captureStream()
                .getVideoTracks()
                .forEach((track) => {
                    finalStream.addTrack(track);
                });

            c.video.currentTime = 0;
            c.video.play();

            // @ts-ignore
            const mediaRecorder = new MediaStreamRecorder(finalStream);
            mediaRecorder.mimeType = 'video/mp4';
            mediaRecorder.start(3000);
            c.video.play();
            render();

            function render() {
                if (c.video && !c.video.paused && !c.video.ended) {
                    console.log('loaded');

                    const time = c.video.currentTime;

                    for (let i = 0; i < c.vidData.length; i++) {
                        const entry = c.vidData[i];
                        if (time < entry.time) {
                            c.currentEntryIndex = i;
                            c.drawCurrent(i, false);
                            break;
                        }
                    }

                    setTimeout(render, 0);
                } else {
                    mediaRecorder.save();
                }

            }
        };
        elementRef.appendChild(button);

    }

}
