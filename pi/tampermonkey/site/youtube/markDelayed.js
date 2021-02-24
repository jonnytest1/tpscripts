/// <reference path="../../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var markDelayed = new EvalScript('', {
    waitForResolver: false,
    run: async (resolv, set) => {
        //let [] = await reqS([]);

        set.interval(() => {
            const scheduledForWeekend = sc.G.g('delayedYoutube');
            /**@type {NodeListOf<CustomYoutubeVideoElement>} */
            let elements = document.querySelectorAll('ytd-grid-video-renderer,ytd-item-section-renderer.ytd-section-list-renderer,ytd-rich-item-renderer');
            //
            for(let el of elements) {
                if(!el.querySelector('#metadata-line') || !el.querySelector('#metadata-line').children[1]) {
                    continue;
                }
                /**
                 * @type {HTMLAnchorElement}
                 */
                const linkElement = el.querySelector('a#thumbnail');
                const url = new URL(linkElement.href);
                url.searchParams.delete('t');
                if(scheduledForWeekend.find(o => o.url === url.href)) {
                    if(el.style.border !== '2px solid green') {
                        el.style.border = '2px solid green';
                    }
                }

            }
        }, 1000);
    },
    reset: (set) => {
        //
    }
});