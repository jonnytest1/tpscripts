/// <reference path="../customTypes/index.d.ts" />

new EvalScript('', {
    run: async (res, set) => {
        const [time, btn, http] = await reqS(['time', 'DOM/button', 'http']);
        /**
        * @typedef VideoElement
        * @property {number} time
        * @property {string} url
        */
        await time.waitForAsync({
            duration: 2000,
            callback: () => true
        });
        const reqUrl = new URL(set.evalScript.getUrl()).searchParams.get('url')
            .replace('rotate/', '');
        const htmlUrl = new URL(decodeURIComponent(reqUrl));

        const doc = await http.document(htmlUrl.href);
        const openedVideosMap = 'crunchyrollOpenedVideosMap';

        /**@type {NodeListOf<HTMLElement>} */
        const items = doc.querySelectorAll('.queue-item');
        await time.asyncForEach({
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

                const showDocument = await http.document(subitem.href);
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

                    /*btn.crIN({
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
                    });*/
                    debugger;
                    open(urlToOpen);
                }

                return true;

            }
        });

        sc.menu.elements.find(el => el.name === 'rotate').normalColor = 'Green';
    }
});
