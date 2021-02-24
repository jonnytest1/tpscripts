/// <reference path="../../customTypes/index.d.ts" />
/// <reference path="../www.youtube.com.js" />
/**
 * @type {EvalScript<{interval:NodeJS.Timeout}>}
 */
var timeset = new EvalScript('', {
    waitForResolver: false,
    run: async (resolv, set) => {
        function checkTime(element) {
            if(!element.querySelector('#metadata-line') || !element.querySelector('#metadata-line').children[1]) {
                return;
            }
            /**
             * @type {CustomYoutubeVideoElement}
             */
            const timeElement = element.querySelector('#metadata-line').children[1];
            if(!timeElement.wentLiveDate) {

                /**@type {string} */
                let wentListString = timeElement.textContent;

                if(!wentListString) {
                    return;
                }

                if(wentListString.endsWith(' ago')) {
                    wentListString = wentListString.split(' ago')[0]
                        .toLowerCase()
                        .replace('streamed ', '');
                } else if(wentListString.includes('vor ')) {
                    wentListString = wentListString.split('vor ')[1];
                }
                /**@type {Number} */
                let durationOffset;
                if(wentListString.toLowerCase()
                    .includes('minute')) {
                    durationOffset = (Number(wentListString.toLowerCase()
                        .split(/ minute*/)[0]) * (1000 * 60));
                } else {
                    durationOffset = (Number(wentListString.toLowerCase()
                        .split(/ Stunden*/)[0]
                        .split(/ hour*/)[0]) * (1000 * 60 * 60));
                }
                const wentLiveDate = new Date(Date.now() - durationOffset);
                timeElement.origWentLive = wentListString;
                timeElement.wentLiveDate = wentLiveDate;
            }
            if(isNaN(timeElement.wentLiveDate.valueOf())) {
                return;
            }

            let duration = Math.floor((Date.now() - timeElement.wentLiveDate.valueOf()) / 1000);
            let seconds = duration % 60;
            let minutes = Math.floor(duration / 60);
            let hours = Math.floor(minutes / 60);
            minutes = (minutes % 60);
            /**@type {HTMLElement} */
            const timeTExt = element.querySelector('#metadata-line > span:nth-child(2)');

            const minuteStr = minutes.toString()
                .padStart(2, '0');

            const secondStr = seconds.toString()
                .padStart(2, '0');

            let hourStr = '';
            if(hours > 0) {
                hourStr = hours + ':';
            }

            let durationStr = `${hourStr}${minuteStr}:${secondStr}`;
            if(durationStr.includes('NaN')) {
                durationStr = '∞';
            } else {
                timeTExt.style.backgroundColor = '#11d1ecb8';
            }
            timeTExt.textContent = `${timeElement.origWentLive} => ${durationStr}`;
        }

        set.interval(() => {
            /**@type {NodeListOf<CustomYoutubeVideoElement>} */
            let elements = document.querySelectorAll('ytd-grid-video-renderer,ytd-item-section-renderer.ytd-section-list-renderer,ytd-rich-item-renderer');
            //
            for(let el of elements) {
                checkTime(el);
            }
        }, 1000);

    },
    reset: (set) => {
        //
    }
});