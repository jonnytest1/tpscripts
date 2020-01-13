/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />
/// <reference path="../libs/math/vector-2d.js" />
new EvalScript('', {
    reset: (obj) => {
        sc.menu.removeByName('video');
        sc.menu.removeByName('pos');
    },
    run: async (resolver) => {
        var hasAdded = false;
        await reqS('libs/math/vector-2d');
        reqS('DOM/customSlider');
        const vid = await sc.g.a('video', undefined, undefined, sc.g.T);

        const LS = await reqS('Storage/localStorage');
        addVideo(vid);
        function addVideo(videoElement) {
            if(videoElement[0]) {
                videoElement = videoElement[0];
            }
            let stdSpeed = LS.g('video_speed', 1);
            videoElement.playbackRate = stdSpeed;
            videoElement.focus();
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
                if(element && element.tagName === 'VIDEO') {
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
                                    stdSpeed = LS.g('video_speed', 1);
                                    let object = new CustomSlider(parent, center, value => {
                                        localVideo.playbackRate = value;
                                        LS.s('video_speed', value);
                                    }, Math.sqrt(stdSpeed * 2500), {
                                        viewRotation: 90 + angle,
                                        mapping: percent => {
                                            var speed = (percent / 50) * (percent / 50);
                                            if(percent < 2) {
                                                speed = -0.5;
                                            }
                                            return speed;
                                        }
                                    });
                                    object.container.style.backgroundColor = '#ffffff6e';
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
                                    }, localVideo.volume * 100, {
                                        viewRotation: 90 + angle
                                    });
                                    object.container.style.backgroundColor = '#ffffff6e';
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

                            const sliderPosition = new Vector2d(center.x, center.y).add(new Vector2d(20, 0).rotated(angle));
                            let object = new CustomSlider(parent, sliderPosition, (percent) => {
                                const current = duration * (percent / 100);
                                localVideo.currentTime = current;
                            }, localVideo.currentTime * 100 / duration, {
                                scale: scale,
                                skipInit: true,
                                viewRotation: angle + 90,
                            });
                            return object.container;
                        }
                    }]
                });
            }
        }
    }
});
