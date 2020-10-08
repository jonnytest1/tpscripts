/// <reference path="../customTypes/index.d.ts" />

new EvalScript('', {
    run: async () => {
        const time = await reqS('time');
        /**
        * @typedef VideoElement
        * @property {number} time
        * @property {string} url
        */
        /**
         * @type {StorageImplementationType<'crunchyrollOpenedVideos',Array<VideoElement>> }
         */
        const lSt = await reqS('Storage/localStorage');

        await time.waitForAsync({
            duration: 2000,
            callback: () => true
        });
        const openedVideosKey = 'crunchyrollOpenedVideos';
        const oneWeekAgo = Date.now() - (1000 * 60 * 60 * 24 * 7);
        const openedVideos = lSt.filter(openedVideosKey, vid => vid.time >= oneWeekAgo);
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

                if(+videoElement.style.width.replace('%', '') < 1 && !openedVideos.some(vid => vid.url === url)) {
                    lSt.p(openedVideosKey, {
                        time: Date.now(),
                        url
                    });
                    open(url);
                    return true;
                }
                return;
            }
        });
    }
});
