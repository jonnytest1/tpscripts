import { Control, ControlPoition } from '../control';
import { Component } from '@angular/core';
import { VidComponent } from '../vid.component';


export class PausePlay extends Control {
    position: ControlPoition = 'right';

    playing = false;

    playTimeout: any;
    run(c: VidComponent, elementRef: HTMLElement): void {
        const button = document.createElement('button');
        button.textContent = 'play';
        button.onclick = () => {
            button.textContent = !this.playing ? 'pause' : 'play';
            if (this.playing) {
                this.pause(c);
            } else {
                this.play(c).then(() => {
                    this.playing = false;
                    button.textContent = this.playing ? 'pause' : 'play';

                });
            }
        };
        elementRef.appendChild(button);
    }


    play(c: VidComponent) {
        this.playing = true;
        const that = this;
        return new Promise(resolver => {


            const finalStream = new MediaStream();
            // @ts-ignore
            c.video.captureStream()
                .getAudioTracks()
                .forEach((track) => {
                    finalStream.addTrack(track);
                });
            // @ts-ignore
            c.canvas.getCanvas().captureStream()
                .getVideoTracks()
                .forEach((track) => {
                    finalStream.addTrack(track);
                });

            c.video.currentTime = 0;
            c.video.play();
            render();
            function render() {
                if (c.video && !c.video.paused && !c.video.ended) {
                    const time = c.video.currentTime;
                    for (let i = 0; i < c.vidData.length; i++) {
                        const entry = c.vidData[i];
                        if (time < entry.time) {
                            c.currentEntryIndex = i;
                            c.drawCurrent(i, false);
                            break;
                        }
                    }
                    that.playTimeout = setTimeout(render, 1 / 30);
                } else {
                    resolver();
                }

            }
        });
    }

    pause(c: VidComponent) {
        this.playing = false;
        c.video.pause();
        clearTimeout(this.playTimeout);

    }

}
