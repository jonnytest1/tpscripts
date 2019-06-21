/*global IMPORT,notification */
/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../notification.js" />
/// <reference path="../site/swatchseries/swatchseries.to.js" />
(async function tvschedule() {
    /**
     * @typedef OpenedShow
     * @property {number} time
     * @property {string} url
     *
     */
    let ewatchopenedvideos = 'openedvideos';

    function getDate() {
        let t = new Date().toString()
            .split(' ');
        let datestring = `${t[0]}, ${t[1]} ${t[2]}`;
        return datestring;
    }
    await sc.g.a('slick-track');
    let days = await sc.g.a('slick-slide');
    let today = [...days].find(d => sc.g('tabs', d).innerText === 'Today');
    if (today) {
        /**
         * followed series
         * @type {Array<CheckedShow>}
         * */
        let followed = sc.G.g('followedtvshows', []);
        /**
         * already opened series
         * @type {Array<OpenedShow>}
         **/
        let opnd = sc.G.filter(ewatchopenedvideos,/**@type {(el:OpenedShow)=>boolean} */ el => el.time + 1000 * 60 * 60 * 24 * 6 >= Date.now());
        //new series
        let yesterday = [...days].findIndex(el => el === today) - 1;
        //recently added complete series
        /**
         * @type {Array<CheckedShow>}
         */
        let recentNew = sc.G.filter('recentNewSeries',/**@type {(el:CheckedShow)=>boolean} */ e => e.ts > Date.now() - 1000 * 60 * 60 * 24 * 14);
        //!!!going minus
        for (let m = yesterday; m >= 0; m--) {
            let day = days[m];
            let showsCount = {};
            /**@type {Array} */
            let shows = sc.g('listings', day).children;
            for (let show of shows) {
                /**@type string */
                let link = show.children[1].href;
                let seriesName = show.children[1].children[0].textContent;
                if (showsCount[seriesName]) {
                    showsCount[seriesName]++;
                    if (showsCount[seriesName] === 5 && !recentNew.some(r => r.name === seriesName)) {
                        GMnot(`${location.host}' new series ${seriesName}`);
                        recentNew.push({ name: seriesName, ts: Date.now() });
                    }
                }
                else {
                    showsCount[seriesName] = 1;
                }
                if (link.indexOf('serie/') > -1) {
                    //new episode isnt added yet
                    let text = link.split('serie/')[1]
                        .split('-')[0];
                    let episodeStrings = show.children[1].textContent.split('\n')[1]
                        .split(' Episode ');
                    let episode = `S${episodeStrings[0].replace('Season ', '')}E${episodeStrings[1]}`;
                    if (followed.find(followedElement => followedElement.name === text)) {
                        let url = sc.g('b', show).parentElement.href;
                        if (!opnd.find(opend => opend.url === url)) {
                            open(`${url}#open=1&ep=${episode}`);
                            sc.G.p(ewatchopenedvideos, {
                                url: url,
                                time: Date.now()
                            });
                        }
                    }
                }
                else {
                    //new episode is added
                    let text = link.split('episode/')[1];
                    if (followed.find(followedElement => text.includes(followedElement.name))) {
                        let url = sc.g('b', show).parentElement.href;
                        if (!opnd.find(opend => opend.url === url)) {
                            sc.G.p(ewatchopenedvideos, {
                                url: url,
                                time: new Date().valueOf()
                            });
                            open(url + '#autoplay=1');
                        }
                    }
                }
            }
        }
        sc.G.s('recentNewSeries', recentNew);
        setTimeout(() => location.reload(), 1000 * 60 * 60 * 12);
    } else {
        setTimeout(tvschedule, 1000);
    }

    try {
        sc.g('modal-backdrop')
            .remove();
    } catch (e) {
        //
    }
})();