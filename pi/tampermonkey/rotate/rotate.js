/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />
/// <reference path="../time.js" />
/// <reference path="../customTypes/rotate.d.ts" />
/**
 * @typedef RotateVals
 * @property {CustomTime} customTime
 * @property {any} hibernateTimeout
 */
/**
 * @type {EvalScript<RotateVals>}
 */
var rotateScript = new EvalScript('', {
    reset(obj) {
        sc.menu.removeByName('rotate');
        clearTimeout(obj.hibernateTimeout);
        obj.customTime.abort = true;
    },
    run: async (resolver, set) => {
        console.log('rotate');
        await reqS('DOM/customSlider');
        await reqS('time');

        if(!document.title.startsWith('ROTATE')) {
            document.title = 'ROTATE ' + document.title;
        }

        let NEXTURL = INJECT;
        /**@type {String[]} */
        let URLS = INJECT;
        /**@type {CustomSlider} */
        let rotationSlider;
        let currentPercent = 0;

        sc.menu.addToMenu({
            name: 'rotate',
            creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu) => {
                const button = menu.createElement(parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu);
                rotationSlider = new CustomSlider(parent, center, undefined, (1 - currentPercent) * 100, {
                    scale: 0.5,
                    color: 'red',
                    arcWidth: 7,
                    skipMouseMove: true,
                    viewRotation: 90 + angle
                });
                rotationSlider.container.style.zIndex = '2199999999';
                return button;
            },
            children: URLS.filter(url => !url.includes(location.href))
                .map(URL => {
                    let displayURL = URL.replace('https://', '');
                    if(displayURL.startsWith('www')) {
                        let splits = displayURL.split('.');
                        splits.shift();
                        displayURL = splits.join('.');
                    }
                    return {
                        name: displayURL,
                        mouseOver: () => {
                            navigate(URL);
                        }
                    };
                })
        });

        sc.menu.addToMenu({
            name: 'next',
            mouseOver: () => navigate(NEXTURL)
        }, el => el.find(l => l.name === 'rotate'));

        set.customTime = new CustomTime();

        const duration = (1000 * 60 * 60 * 1.2 * (Math.random() + 1)) / URLS.length;
        function progressOverlayRegression() {
            set.customTime.waitFor({
                duration: duration,
                callback: () => {
                    navigate(NEXTURL);
                },
                onStep: (percent) => {
                    if(rotationSlider) {
                        rotationSlider.setPercent(1 - percent);
                        rotationSlider.blink();
                    }
                }
            });
        }
        progressOverlayRegression();
        //lets see if this survives hibernate
        set.hibernateTimeout = setTimeout(progressOverlayRegression, duration * 8);
    }
});
