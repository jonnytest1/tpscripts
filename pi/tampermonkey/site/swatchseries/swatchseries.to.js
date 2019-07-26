/// <reference path="../../customTypes/index.d.ts" />
/// <reference path="../../DOM/CircularMenu.js" />

/**
 * @typedef CheckedShow
 * @property {string} name
 * @property {number} ts
 */

new EvalScript('', {
    run: async () => {
        /**@type {Array<HTMLLinkElement>} */
        let links = sc.g('a');
        if(links) {
            const circularMenu = await reqS('DOM/CircularMenu');
            const tvshows = 'followedtvshows';
            for(let link of links) {
                if(link.href && link.href.indexOf('/serie/') > -1) {
                    new circularMenu(link, [
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
                    ], {

                        });
                }
            }
        }
    }
});