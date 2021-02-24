/// <reference path="../customTypes/index.d.ts" />

new EvalScript('', {
    run: async () => {
        const [time, btn] = await reqS(['time', 'DOM/button']);
        /**
        * @typedef VideoElement
        * @property {number} time
        * @property {string} url
        */

        await time.waitForAsync({
            duration: 2000,
            callback: () => true
        });
        const openedVideosMap = 'crunchyrollOpenedVideosMap';

        /**@type {NodeListOf<HTMLElement>} */
        const items = document.querySelectorAll('.queue-item');
        time.asyncForEach({
            array: [...items],
            subItemType: 'a',
            subitemOptions: {
                text: 'Showinformationen'
            },
            callback: async (item, subitem) => {

                if(!subitem) {
                    return;
                }
                console.log(subitem.href);

                const openedVideosByShow = sc.G.filter(openedVideosMap, StorageImplementation.filterDaysFunction(14, {
                    keepLatest: true
                }), {
                    mapKey: subitem.href
                });

                const showResponse = await fetch(subitem.href);
                const showHTML = await showResponse.text();
                const showDocument = new DOMParser().parseFromString(showHTML, 'text/html');
                const episodes = [...showDocument.querySelectorAll('.list-of-seasons .portrait-grid .group-item')];

                let urlToOpen = null;
                for(let episode of episodes) {
                    const episodeLink = episode.querySelector('a');
                    const url = new URL(episodeLink.href);
                    url.searchParams.delete('t');

                    if(openedVideosByShow.some(el => el.value === url.href)) {
                        break;
                    } else {
                        urlToOpen = url.href;
                    }
                }
                if(urlToOpen) {
                    sc.G.p(openedVideosMap, {
                        timestamp: Date.now(),
                        value: urlToOpen
                    }, {
                        mapKey: subitem.href
                    });

                    btn.crIN({
                        parent: item,
                        text: 'setLAtest',
                        onclick: () => {
                            const url = new URL(episodes[0].querySelector('a').href);
                            url.searchParams.delete('t');

                            sc.G.p(openedVideosMap, {
                                timestamp: Date.now(),
                                value: url.href
                            }, {
                                mapKey: subitem.href
                            });
                        }, styles: {
                            position: 'relative'
                        }
                    });

                    open(urlToOpen);
                }

                return true;

            }
        });

    }
});
