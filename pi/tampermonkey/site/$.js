/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />

new EvalScript('', {
    reset: (obj) => {
        sc.menu.removeByName('video');
        sc.menu.removeByName('pos');
    },
    run: async (resolver) => {
        var hasAdded = false;

        reqS('DOM/customSlider')
            .then(() => {
                sc.g.a('video', undefined, undefined, sc.g.T)
                    .then(addVideo);
            });

        function addVideo(videoElement) {
            if(videoElement[0]) {
                videoElement = videoElement[0];
            }
            /**
             * @param {HTMLElement} parent
             * @returns {HTMLVideoElement & {
             *  previousStyle:CSSStyleDeclaration
             *  parentElement:{webkitRequestFullScreen:Function}
             * }}
             */
            function getVideo(parent) {
                let localVideo = videoElement;
                let element = document.elementFromPoint(parent.offsetLeft, parent.offsetTop);
                if(element.tagName === 'VIDEO') {
                    localVideo = element;
                }
                return localVideo;
            }

            if(!hasAdded) {
                hasAdded = true;
                if(!videoElement.hasStarted) {
                    videoElement.hasStarted = true;
                    videoElement.play();
                }

                sc.menu.addToMenu({
                    name: 'video',
                    isValid: () => true,
                    children: [
                        {
                            name: 'play',
                            isValid: () => videoElement.paused,
                            mouseOver: () => {
                                videoElement.play();
                            }
                        }, {
                            name: 'pause',
                            isValid: () => videoElement.paused === false,
                            mouseOver: (parent) => {
                                const localVideo = getVideo(parent);
                                localVideo.pause();
                            }
                        }, {
                            name: 'fullscreen',
                            mouseOver: (parent) => {
                                const localVideo = getVideo(parent);
                                if(!document.fullscreen) {
                                    localVideo.previousStyle = localVideo.style;
                                    localVideo.style.width = '100%';
                                    localVideo.style.height = '100%';
                                    localVideo.parentElement.webkitRequestFullScreen();
                                } else {
                                    localVideo.style.width = 'unset';
                                    localVideo.style.height = 'unset';
                                    for(let st in localVideo.previousStyle) {
                                        localVideo.style[st] = localVideo.previousStyle[st];
                                    }
                                    document.exitFullscreen();
                                }
                            }
                        }, {
                            name: 'speed',
                            children: [{
                                creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle) => {
                                    let localVideo = getVideo(parent);
                                    let object = new CustomSlider(parent, center, (precent) => {
                                        var speed = (precent / 50) * (precent / 50);
                                        if(precent < 2) {
                                            speed = -0.5;
                                        }
                                        localVideo.playbackRate = speed;
                                    }, Math.sqrt(localVideo.playbackRate * 2500));
                                    object.container.style.backgroundColor = '#ffffff6e';
                                    object.setSeparate(angle);
                                    return object.container;
                                }
                            }],
                        }, {
                            name: 'volume',
                            children: [{
                                creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle) => {
                                    let localVideo = getVideo(parent);
                                    let object = new CustomSlider(parent, center, (precent) => {
                                        if(localVideo.muted) {
                                            localVideo.muted = false;
                                        }
                                        localVideo.volume = precent / 100;
                                    }, localVideo.volume * 100);
                                    object.container.style.backgroundColor = '#ffffff6e';
                                    object.setSeparate(angle);
                                    return object.container;
                                }
                            }],
                        }
                    ]
                });

                sc.menu.addToMenu({
                    name: 'pos',
                    children: [{
                        creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle) => {
                            let localVideo = getVideo(parent);
                            let scale = 5;
                            let duration = localVideo.duration;
                            if(isNaN(duration)) {
                                duration = 0;
                            }
                            let object = new CustomSlider(parent, center, (percent) => {
                                const current = duration * (percent / 100);
                                localVideo.currentTime = current;
                            }, localVideo.currentTime * 100 / duration, { scale: scale, skipInit: true });
                            let rotationStyle = `rotate(${90 + (angle)}deg)`;

                            let globlaTranslate = ` translate(${(object.container.dim.width / 2) - (19 * scale)}px,${22 * scale}px)`;
                            object.container.style.transform = `translate(-230px, 6px) ${rotationStyle} translate(-30px, 30px)`;
                            return object.container;
                        }
                    }]
                });
            }
        }
    }
});
