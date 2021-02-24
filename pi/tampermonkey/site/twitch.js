/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var twitch = new EvalScript('', {
    waitForResolver: true,
    run: async (resolv, set) => {

        if(await sc.g.eval('h2', { text: 'Stunden', first: true, await: true })) {
            const video = sc.g.eval('video', { first: true });

            const currentTimestamps = sc.G //
                .filter('twitchvideoposition', StorageImplementation.filterDaysFunction(1, { keepLatest: true }))
                .filter(vid => vid.value.url === location.href);
            if(currentTimestamps.length) {
                video.currentTime = currentTimestamps[currentTimestamps.length - 1].value.currentTime - 2;
            }
            const addPosition = () => {
                sc.G.p('twitchvideoposition', { timestamp: Date.now(), value: { currentTime: video.currentTime, url: location.href } });
            };
            setInterval(addPosition, 5000);
            window.onunload = addPosition;
        }

    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
twitch;