///<reference path="../../customTypes/index.d.ts" />
/**
 * @type {EvalScript<{overlayInterval:NodeJS.Timeout}>}
 */
var vid = new EvalScript('', {
    run: async (resolver, set) => {
        if(document.querySelector('#header .container1 #logo a img')) {
            const other = await reqS('Videos/automation');
            if(document.querySelector('#container').children[1].textContent === 'File Not Found') {
                other();
            }

            set.overlayInterval = setInterval(() => {
                const overlay = sc.g.point(400, 400);
                if(overlay.tagName !== 'VIDEO') {
                    overlay.parentElement.style.zIndex = '0';
                    overlay.parentElement.style.position = 'relative';
                }
            }, 300);
        } else {
            GMnot('didnt match setup');
        }

    },
    reset: (set) => {
        clearTimeout(set.overlayInterval);
    }
});