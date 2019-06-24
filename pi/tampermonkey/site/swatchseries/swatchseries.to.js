/*global sc,DOM_CircularMenu */

/**
 * @typedef CheckedShow
 * @property {string} name
 * @property {number} ts
 */

let links = sc.g('a');
if (links) {
    const tvshows = 'followedtvshows';
    for (let link of links) {
        if (link.href && link.href.indexOf('/serie/') > -1) {
            new CircularMenu(link, [
                {
                    name: 'add',
                    onclick: (btn) => {
                        /**@type {CheckedShow} */
                        const show = {
                            name: btn.target.href.split('serie/')[1]
                                .split('-')[0], ts: Date.now()
                        };
                        sc.G.p(tvshows, show, []);
                    },
                    isValid: (btn) => {
                        /**@type Array<CheckedShow> */
                        let followedShows = sc.G.g(tvshows, []);
                        return !followedShows.some(el => el.name === btn.href.split('serie/')[1]
                            .split('-')[0]);
                    }
                }, {
                    name: 'remove',
                    enabledColor: 'red',
                    onclick: (btn) => {
                        let seriesLink = btn.target.href.split('serie/')[1]
                            .split('-')[0];
                        debugger;
                        sc.G.remove(tvshows, (obj) => obj.name === seriesLink);
                    },
                    isValid: (btn) => {
                        /**@type Array<CheckedShow> */
                        let followedShows = sc.G.g(tvshows, []);
                        return followedShows.some(el => el.name === btn.href.split('serie/')[1]
                            .split('-')[0]);
                    }
                }
            ]);
        }
    }
}