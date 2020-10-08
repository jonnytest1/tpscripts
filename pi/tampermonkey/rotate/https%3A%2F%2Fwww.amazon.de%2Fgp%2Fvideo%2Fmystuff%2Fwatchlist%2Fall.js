/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var amazon = new EvalScript('', {
    async: true,
    run: async (resolv, set) => {
        let timer = await reqS('time');
        return;
        const items = [...document.querySelectorAll('[data-automation-id=\'list-grid\'] [data-automation-id^=\'wl-item\']')];
        if(items.length == 0) {
            GMnot('amazon didnt find videos');
        }

        //const watchList = sc.G.g('amazonWatchList', {});
        timer.asyncForEach({
            array: items,
            callback: async (item) => {
                const watchId = item.attributes['data-automation-id'].value.split('wl-item-')[1];
                const response = await fetch(`https://www.amazon.de/gp/video/detail/${watchId}#pleaseimplementanalertfornewseries`);
                const html = await response.text();
                const jsonStr = html.split('<script type="text/template">')
                    .map(str => str.split('</script>')[0])
                    .filter(jsonS => jsonS.includes('"episode"'))[0];
                const json = JSON.parse(jsonStr);
                const detailsElements = json.props.state.detail.detail;

                const episodes = Object.keys(detailsElements)
                    .map(key => {
                        detailsElements[key].identifier = key;
                        return detailsElements[key];
                    })
                    .filter(show => show.episodeNumber > 0);

                const episodesWithWatchTime = episodes.map(ep => {
                    try {
                        const watchPercent = html.split(`for="selector-${ep.identifier}"></label>`)[1]
                            .split(' title="Folge')[0]
                            .split('aria-valuenow="')[1]
                            .split('"')[0];
                        ep.watchPercent = watchPercent;
                    } catch(e) {
                        //idc
                    }
                    return ep;
                });

                const unwatchedEpsiodes = episodesWithWatchTime.filter(ep => !ep.watchPercent || (+ep.watchPercent) < 10);
                //
                if(unwatchedEpsiodes.length > 0) {
                    debugger;
                    GMnot('unwatched amazon', `${unwatchedEpsiodes[0].title}\n${unwatchedEpsiodes[0].parentTitle}`);
                }
                debugger;

                return true;
            },
            delay: 1000
        });
    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
amazon;