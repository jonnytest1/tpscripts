/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />
/// <reference path="../libs/math/vector-2d.js" />

/**
 * @type {{type:EvalScript<{abc:boolean}>}}
 */
EvalScript.type = new EvalScript('', {
    reset: (obj) => {
        sc.menu.removeByName('video');
        sc.menu.removeByName('pos');
    },
    run: async (resolver) => {
        var hasAdded = false;
        await reqS('libs/math/vector-2d');
        reqS('DOM/customSlider');

        function getBackgroundElement() {
            /**
                       * @type {Array<{ct:number,el:HTMLElement|Element}>}
                       */
            let els = [];
            for(let i = 0; i < window.innerHeight; i += 20) {
                for(let j = 0; j < window.innerWidth; j += 20) {
                    const element = document.elementFromPoint(j, i);

                    let prev = els.find(innerElement => innerElement.el === element);

                    if(!prev) {
                        els.push({ el: element, ct: 1 });
                    } else {
                        prev.ct++;
                    }
                }
            }
            let max = -1;
            /**
             * @type {HTMLElement|Element}
             */
            let el = null;
            for(let i of els) {
                if(i.ct > max) {
                    max = i.ct;
                    el = i.el;
                }
            }
            return el;
        }

        let setActive = false;
        function setBackgroundActive() {
            if(setActive) {
                return;
            }
            setActive = true;
            const el = getBackgroundElement();
            if('style' in el) {
                const orignalColor = getComputedStyle(el).backgroundColor;

                (function gradient(percent = 0) {
                    el.style.backgroundImage = `radial-gradient(circle at center,${orignalColor},${orignalColor},${orignalColor},
                        ${orignalColor},${orignalColor},${orignalColor},${orignalColor},${orignalColor},rgba(248,183,10,${percent / 100}),${orignalColor})`;
                    if(percent === 72) {
                        return;
                    }
                    setTimeout(gradient, 100, percent + 4);
                })();

                // document.body.style.height = 'fit-content';
            }
        }
        if(!location.origin.includes('twitch')) {
            window.addEventListener('load', setBackgroundActive);
            setTimeout(setBackgroundActive, 1000);
        }

        const vid = await sc.g.a('video', undefined, undefined, sc.g.T);

        //radial-gradient(circle at center,rgba(0,0,0,1),rgba(255,255,0,0.9))"
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
                                videoElement.focus();
                            }
                        }, {
                            name: 'pause',
                            isValid: () => videoElement.paused === false,
                            mouseOver: (parent) => {
                                const localVideo = getVideo(parent);
                                localVideo.pause();
                                localVideo.focus();
                            }
                        }, {
                            name: 'fullscreen',
                            mouseOver: (parent) => {
                                const localVideo = getVideo(parent);
                                // debugger;
                                if(!document.fullscreen) {
                                    localVideo.previousStyle = { ...localVideo.style };
                                    localVideo.parentElement.webkitRequestFullScreen();
                                    setTimeout(() => {
                                        localVideo.style.width = '100%';
                                        localVideo.style.height = '100%';
                                        localVideo.style.left = localVideo.style.top = '0px';

                                    }, 100);

                                } else {
                                    document.exitFullscreen();
                                    localVideo.style.width = 'unset';
                                    localVideo.style.height = 'unset';
                                    for(let st in localVideo.previousStyle) {
                                        localVideo.style[st] = localVideo.previousStyle[st];
                                    }
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
