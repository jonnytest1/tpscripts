/**
 * @type {EvalScript<{overlayInterval:NodeJS.Timeout}>}
 */
var vid = new EvalScript('', {
    run: async (resolver, set) => {
        const other = await reqS('Videos/automation');
        if(document.querySelector('#container').children[1].textContent === 'File Not Found') {
            other();
        }

        set.overlayInterval = setInterval(() => {
            const overlay = document.elementFromPoint(400, 400);
            if(overlay.tagName !== 'VIDEO') {
                /**
                 * @type {HTMLElement}
                 */
                // @ts-ignore
                const castedOverlay = overlay;
                castedOverlay.parentElement.style.zIndex = '0';
            }
        }, 300);
    },
    reset: (set) => {
        clearTimeout(set.overlayInterval);
    }
});