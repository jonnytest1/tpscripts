/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />
/// <reference path="../libs/math/vector-2d.js" />

/**
 * @typedef {{
 *   timestamp:number,
 *   action:string
 * }}  HistoryElement
 *
 * @typedef {HTMLVideoElement & {
    *  previousStyle:CSSStyleDeclaration
    *  skipLoop:any
    *  hasStarted?:boolean
    *  parentElement:{webkitRequestFullScreen:Function}
    *  history:Array<HistoryElement>
    * }} CustomVideElement
 */
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

            if(setActive || true === true) {
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
        /**
         * @type {StorageImplementationType<'video_speed',number>}
         */
        const LS = await reqS('Storage/localStorage');
        addVideo(vid);

        /**
         * @param {CustomVideElement} videoElement
         */
        function addVideo(videoElement) {
            if(videoElement[0]) {
                videoElement = videoElement[0];
            }
            if(true) {
                let stdSpeed = LS.g('video_speed', 1);
                videoElement.playbackRate = stdSpeed;
            }
            videoElement.focus();
            /**
             * @param {HTMLElement} parent
             * @returns {CustomVideElement}
             */
            function getVideo(parent) {
                let localVideo = videoElement;
                /**
                 * @type {CustomVideElement}
                 */
                let element = sc.g.point(parent.offsetLeft, parent.offsetTop);
                if(element && element.tagName === 'VIDEO') {
                    localVideo = element;
                }
                return localVideo;
            }

            function addAction(action) {
                const now = Date.now();
                if(!videoElement.history.length || videoElement.history[videoElement.history.length - 1].timestamp < now - 1000) {
                    videoElement.history.push({ timestamp: now, action });
                }
            }

            if(!hasAdded) {
                hasAdded = true;
                if(!videoElement.hasStarted && !videoElement.paused) {
                    videoElement.hasStarted = true;
                    videoElement.play();
                }
                videoElement.history = [];
                Object.defineProperty(videoElement, 'currentTime', {
                    enumerable: true,
                    configurable: true,
                    get: function() {
                        var ct = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime')
                            .get
                            .call(this);
                        return ct;
                    },
                    set: function(newValue) {
                        addAction('set time');
                        // intercept values here
                        Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,
                            'currentTime').set
                            .call(this, newValue);
                    }
                });

                Object.defineProperty(videoElement, 'pause', {
                    enumerable: true,
                    configurable: true,
                    value: new Proxy(videoElement.pause, {
                        apply: (target, thisarg, args) => {
                            addAction('pause');
                            target.call(thisarg, ...args);
                        }
                    })
                });

                sc.menu.addToMenu({
                    name: 'video',
                    rotation: 0,
                    normalColor: 'Aqua',
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
                                localVideo.focus();
                                const volume = localVideo.volume;
                                const i = setInterval(() => {
                                    localVideo.volume -= 0.02;
                                    if(localVideo.volume < 0.1) {
                                        localVideo.pause();
                                        localVideo.volume = volume;
                                        clearInterval(i);
                                    }
                                }, 100);

                            }
                        }, {
                            name: 'fullscreen',
                            mouseOver: parent => {
                                const localVideo = getVideo(parent);
                                // debugger;
                                if(!document.fullscreen) {
                                    localVideo.previousStyle = { ...localVideo.style };
                                    localVideo.focus();
                                    localVideo.parentElement.webkitRequestFullScreen();
                                    setTimeout(() => {
                                        localVideo.style.width = '100%';
                                        localVideo.style.height = '100%';
                                        localVideo.style.left = localVideo.style.top = '0px';

                                    }, 500);

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
                                creationFunction: (parent, _, _1, _2, _3, _4, center, angle) => {
                                    let localVideo = getVideo(parent);//
                                    const stdSpeed = LS.g('video_speed', 1);
                                    let object = new CustomSlider(parent, center, value => {
                                        localVideo.playbackRate = value;
                                        LS.s('video_speed', value);
                                    }, Math.sqrt(stdSpeed * 2500), {
                                        viewRotation: 90 + angle,
                                        additionalText: (speed) => {
                                            const remaining = localVideo.duration - localVideo.currentTime;
                                            if(isNaN(remaining)){
                                                return '-- : --';
                                            }
                                            const duration = Math.round(remaining / speed);
                                            let seconds = duration % 60;
                                            let minutes = Math.floor(duration / 60);

                                            let hour = '';
                                            if(minutes > 60) {
                                                const hours = Math.floor(minutes / 60);
                                                minutes = minutes % 60;
                                                hour = `${hours}h `;
                                            }
                                            const minsec = `${minutes}m ${seconds}s`;
                                            return `${hour}${minsec}`;
                                        },
                                        mapping: percent => {
                                            return (percent / 50) * (percent / 50);
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
                                    let object = new CustomSlider(parent, center, precent => {
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
                    children: [
                        {
                            name: 'history',
                            mouseOver: (parent, btn) => {
                                /**
                                * @type {Array<MenuElementItem>}
                                */
                                const historyChildren = (getVideo(parent).history || [{ timestamp: 0, action: 'test' }]).map(historyEl => ({
                                    name: `${new Date(historyEl.timestamp).toISOString()} ${historyEl.action}`,
                                    style: {
                                        fontSize: 10
                                    }

                                }));
                                if(historyChildren[0]) {
                                    historyChildren[0].rotation = -45;
                                }
                                btn.menuOption.children = historyChildren;
                            }
                        },
                        {
                            name: 'forward',
                            mouseOver: (parent) => {
                                const video = getVideo(parent);
                                let increment = 5;
                                video.skipLoop = setInterval(() => {
                                    video.currentTime += increment++;
                                }, 400);
                            }, mouseLeave: (parent) => {
                                const video = getVideo(parent);
                                if(video.skipLoop) {
                                    clearInterval(video.skipLoop);
                                }
                            }
                        },
                        {
                            creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle) => {
                                let localVideo = getVideo(parent);
                                let scale = 5;
                                let duration = localVideo.duration;

                                if(isNaN(duration)) {
                                    duration = 0;
                                }

                                const sliderPosition = new Vector2d(center.x, center.y).add(new Vector2d(20, 0).rotated(angle));
                                let object = new CustomSlider(parent, sliderPosition, percent => {
                                    const current = duration * (percent / 100);
                                    localVideo.currentTime = current;
                                }, localVideo.currentTime * 100 / duration, {
                                    scale: scale,
                                    skipInit: true,
                                    viewRotation: angle + 90,
                                });
                                return object.container;
                            }
                        }, {
                            name: 'backwards',
                            mouseOver: (parent) => {
                                const video = getVideo(parent);
                                let increment = 5;
                                video.skipLoop = setInterval(() => {
                                    video.currentTime -= increment++;
                                }, 400);
                            }, mouseLeave: (parent) => {
                                const video = getVideo(parent);
                                if(video.skipLoop) {
                                    clearInterval(video.skipLoop);
                                }
                            }
                        }]
                });
            }
        }
    }
});
