/// <reference path="../customTypes/index.d.ts"/>
/**
 * @type {EvalScript<{autoInterval}>}
 */
var auto = new EvalScript('', {
    run: async (resolver, options) => {
        (async () => {
            const cdSt = await reqS('Storage/crossDomainStorage');

            function other() {
                const allLinks = sc.CD.g('links', []);
                const link = allLinks.shift();
                sc.CD.s('links', allLinks);
                sc.CD.p('exclude', link.link);
                location.href = link.link;
            }

            /**
             * @type {Array<any>}
             */
            const buttons = cdSt.g('nextbuttons', []);
            if(buttons.length > 0) {
                const nextAr = buttons.find(ar => ar[0] === 'next');
                sc.menu.addToMenu({
                    name: 'next',
                    mouseOver: () => {
                        location.href = nextAr[1] + '#autoplay=true';
                    }
                });
                sc.menu.addToMenu({
                    name: 'other',
                    mouseOver: other
                });

                sc.g.a('video', undefined, undefined, sc.g.T)
                    .then(/**@param {HTMLVideoElement} video*/video => {
                        video.parentElement.requestFullscreen();
                        options.autoInterval = setInterval(() => {
                            if(video.currentTime > video.duration - 1) {
                                location.href = nextAr[1] + '#autoplay=true';
                            }
                        }, 1000);
                    });
            }
            resolver(other);
        })();
        return true;
    }, reset: (data) => {
        sc.menu.removeByName('next');
        if(data.autoInterval) {
            clearInterval(data.autoInterval);
        }
    }
});