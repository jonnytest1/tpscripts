/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />
/// <reference path="../time.js" />
/// <reference path="../customTypes/rotate.d.ts" />
/**
 * @typedef RotateVals
 * @property {CustomTime} customTime
 * @property {any} hibernateTimeout
 * @property {NodeJS.Timeout} overlayInterval
 */
/**
 * @type {EvalScript<RotateVals>}
 */
var rotateScript = new EvalScript('', {
    reset(obj) {
        sc.menu.removeByName('rotate');
        clearTimeout(obj.hibernateTimeout);
        clearTimeout(obj.overlayInterval);
        obj.customTime.abort = true;

    },
    run: async (resolver, set) => {
        console.log('rotate');
        const [ls] = await reqS(['Storage/localStorage', 'DOM/customSlider', 'time']);

        if(!document.title.startsWith('ROTATE')) {
            document.title = 'ROTATE ' + document.title;
            /* Object.defineProperty(document, 'title', {
                 set: () => {
                     //no setting after this
                 }
             });*/
        }

        /**@type {String[]} */
        let URLS = INJECT;
        /**@type {CustomSlider} */
        let rotationSlider;
        let currentPercent = 0;

        let currentlyChecking = ls.g('currentUrl', '') || URLS[0];

        sc.menu.addToMenu({
            name: 'rotate',
            rotation: 0,
            creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, context) => {
                const button = context.menu.createElement(parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, context);
                rotationSlider = new CustomSlider(parent, center, undefined, (1 - currentPercent) * 100, {
                    scale: 0.5,
                    color: 'red',
                    arcWidth: 5,
                    skipMouseMove: true,
                    viewRotation: 90 + angle
                });
                rotationSlider.container.style.zIndex = '2199999999';
                return button;
            },
            children: URLS.filter(url => !url.includes(location.href))
                .map(url => {
                    let displayURL = url.replace('https://', '');
                    if(displayURL.startsWith('www')) {
                        let splits = displayURL.split('.');
                        splits.shift();
                        displayURL = splits.join('.');
                    }
                    return {
                        name: displayURL,
                        mouseOver: () => {
                            checkUrl(url, false);
                        }
                    };
                })
        });

        set.customTime = new CustomTime();
        const duration = (1000 * 60 * 60 * 1.2 * (Math.random() + 1)) / URLS.length;
        checkUrl(currentlyChecking, true);

        /**
         *
         * @param {string} url
         * @param {boolean} reapeated
         */
        async function checkUrl(url, reapeated = true) {
            //  const urlResponse = await fetch(url);
            // const urlContent = await urlResponse.text();
            const urlToCheck = new URL(url);

            ls.s('currentUrl', urlToCheck.href);
            sc.menu.elements.find(el => el.name === 'rotate').children
                .forEach(child => {
                    if(url.includes(child.name)) {
                        child.normalColor = 'Orange';
                    } else {
                        child.normalColor = 'White';
                    }
                });
            //@ts-ignore
            reqS('rotate/' + encodeURIComponent(urlToCheck.href.replace(urlToCheck.search, urlToCheck.search.replace(/=/g, '%3D')
                .replace('&', '%26'))
                .replace('#', '')), { cache: false });

            const nextUrl = URLS[URLS.indexOf(url) + 1] || URLS[0];

            if(reapeated) {
                set.customTime.waitFor({
                    duration: duration,
                    callback: () => {
                        checkUrl(nextUrl, true);
                    },
                    onStep: (percent) => {
                        if(rotationSlider) {
                            rotationSlider.setPercent(1 - percent);
                            rotationSlider.blink();
                        }
                    }
                });
                clearTimeout(set.hibernateTimeout);
                set.hibernateTimeout = setTimeout(() => {
                    checkUrl(nextUrl, true);
                }, duration * 8);
            }
        }

        const dayOfWeek = new Date().getDay();
        if((dayOfWeek > 5 || dayOfWeek === 0) && new Date().getHours() > 6) {
            const videos = sc.G.g('delayedYoutube');
            videos.forEach(vidElement => {
                GM_openInTab.override = true;
                open(vidElement.url);
            });
            sc.G.s('delayedYoutube', []);
        }

    }
});
