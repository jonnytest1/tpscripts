/// <reference path="../customTypes/index.d.ts" />

new EvalScript('', {
    run: async () => {
        const time = await reqS('time');
        const lSt = await reqS('Storage/localStorage');
        await time.waitForAsync({
            duration: 2000,
            callback: () => true
        });
        const openedVideosKey = 'crunchyrollOpenedVideos';
        /**
         * @typedef VideoElement
         * @property {number} time
         * @property {string} url
         */
        const oneWeekAgo = Date.now() - (1000 * 60 * 60 * 24 * 7);
        const openedVideos = lSt.filter(openedVideosKey,/**@param {VideoElement} vid */vid => vid.time >= oneWeekAgo);
        /**@type {NodeListOf<HTMLElement>} */
        const items = document.querySelectorAll('.queue-item');
        time.asyncForEach({
            array: [...items],
            callback: async (item) => {
                /**@type {HTMLElement} */
                const videoElement = item.querySelector('.episode-progress');
                const url = sc.g('episode', item).href;
                if(+videoElement.style.width.replace('%', '') < 1 && !openedVideos.some(vid => vid.url === url)) {
                    /**@type {VideoElement} */
                    const openedVideo = {
                        time: Date.now(),
                        url
                    };
                    lSt.p(openedVideosKey, openedVideo);
                    open(url);
                    return;
                }
                return false;
            }
        });
    }
});
