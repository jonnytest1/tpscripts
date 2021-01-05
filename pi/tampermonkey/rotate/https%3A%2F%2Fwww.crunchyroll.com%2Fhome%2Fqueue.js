/// <reference path="../customTypes/index.d.ts" />

new EvalScript('', {
    run: async () => {
        const time = await reqS('time');
        /**
        * @typedef VideoElement
        * @property {number} time
        * @property {string} url
        */

        await time.waitForAsync({
            duration: 2000,
            callback: () => true
        });
        const openedVideosKey = 'crunchyrollOpenedVideos';
        const openedVideos = sc.G.filter(openedVideosKey, StorageImplementation.filterDaysFunction(14, { keepLatest: true }));
        /**@type {NodeListOf<HTMLElement>} */
        const items = document.querySelectorAll('.queue-item');
        time.asyncForEach({
            array: [...items],
            callback: async (item) => {
                /**@type {HTMLElement} */
                const videoElement = item.querySelector('.episode-progress');
                /** @type {HTMLAnchorElement} */
                const episodeLink = item.querySelector('a.anchor-to-episode');
                const episodeTitle = episodeLink.title;
                const url = episodeLink.href;

                if(+videoElement.style.width.replace('%', '') < 1 && !openedVideos.some(vid => vid.value === url)) {
                    sc.G.p(openedVideosKey, {
                        timestamp: Date.now(),
                        value: url
                    });
                    open(url);
                    return true;
                }
                return;
            }
        });
    }
});
