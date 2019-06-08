/* global sc,IMPORT */
/**@type {CustomHTMLscript}*/
var vidScr = document.currentScript;
vidScr.reset = () => {
    sc.menu.elements = sc.menu.elements.filter(el => el.name != "video");
    sc.menu.elements = sc.menu.elements.filter(el => el.name != "pos");

}
var hasAdded = false;
reqS("DOM/customSlider").then(() => {
    sc.g.a('video', undefined, undefined, sc.g.T).then(addVideo);
})


function addVideo(videoElement) {
    if (!hasAdded) {
        hasAdded = true;
        videoElement.play();

        sc.menu.addToMenu({
            name: "video",
            isValid: () => true,
            children: [
                {
                    name: "play",
                    isValid: () => videoElement.paused,
                    mouseOver: () => {
                        videoElement.play();
                    }
                }, {
                    name: "pause",
                    isValid: () => videoElement.paused == false,
                    mouseOver: () => {
                        videoElement.pause();
                    }
                }, {
                    name: "fullscreen",
                    mouseOver: () => {
                        if (!document.fullscreen) {
                            videoElement.previousStyle = videoElement.style;
                            videoElement.style.width = "100%";
                            videoElement.style.height = "100%";
                            videoElement.parentElement.webkitRequestFullScreen();
                        } else {
                            videoElement.style = videoElement.previousStyle;
                            document.exitFullscreen();
                        }
                    }
                }, {
                    name: "speed",
                    children: [{
                        creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle) => {
                            let object = new CustomSlider(parent, center, (precent) => {
                                var speed = (precent / 50) * (precent / 50);
                                videoElement.playbackRate = speed;
                            }, Math.sqrt(videoElement.playbackRate * 2500));
                            object.container.style.backgroundColor = "#ffffff6e";
                            object.setSeparate(angle);
                            return object;
                        }
                    }],
                }, {
                    name: "volume",
                    children: [{
                        creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle) => {
                            let object = new CustomSlider(parent, center, (precent) => {
                                videoElement.volume = precent / 100;
                            }, videoElement.volume * 100);
                            object.container.style.backgroundColor = "#ffffff6e";
                            object.setSeparate(angle);
                            return object;
                        }
                    }],
                }
            ]
        });

        sc.menu.addToMenu({
            name: "pos",
            children: [{
                creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle) => {
                    let scale = 5;
                    let duration = videoElement.duration;
                    if (isNaN(duration)) {
                        duration = 0;
                    }
                    let object = new CustomSlider(parent, center, (percent) => {
                        const current = duration * (percent / 100);
                        videoElement.currentTime = current;
                    }, videoElement.currentTime * 100 / duration, { scale: scale, skipInit: true });
                    let rotationStyle = "rotate(" + (90 + (angle)) + "deg)";
                    let globlaTranslate = " translate(" + ((object.container.dim.width / 2) - (19 * scale)) + "px," + (22 * scale) + "px)";
                    object.container.style.transform = "translate(-230px, 6px) " + rotationStyle + " translate(-30px, 30px)";
                    return object;
                }
            }]
        });
    }
}