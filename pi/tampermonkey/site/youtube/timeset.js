/// <reference path="../../customTypes/index.d.ts" />
/// <reference path="../www.youtube.com.js" />
/**
 * @type {EvalScript<{interval:NodeJS.Timeout}>}
 */
var timeset = new EvalScript('', {
    waitForResolver: false,
    run: async (resolv, set) => {
        /**
         * @param {CustomYoutubeVideoElement} element
         */
        function checkTime(element) {
            if(!element.querySelector('#metadata-line') || !element.querySelector('#metadata-line').children[1]) {
                return;
            }
            const timeElement = element.querySelector('#metadata-line').children[1];
            const titleText = element.querySelector('h3').textContent
                .trim();
            if(!element.wentLiveDate || titleText !== element.textCmp) {

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
                element.origWentLive = wentListString;
                element.wentLiveDate = wentLiveDate;
                element.textCmp = titleText;
            }

            let duration = Math.floor((Date.now() - element.wentLiveDate.valueOf()) / 1000);
            let seconds = duration % 60;
            let minutes = Math.floor(duration / 60);
            let hours = Math.floor(minutes / 60);
            minutes = (minutes % 60);

            if(!element.timeDisplay) {
                element.timeDisplay = document.createElement('span');
                element.querySelector('#metadata-line')
                    .appendChild(element.timeDisplay);
            }

            if(isNaN(element.wentLiveDate.valueOf())) {
                element.timeDisplay.textContent = '=>';
                return;
            }

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
                element.timeDisplay.style.backgroundColor = '#11d1ecb8';
            }
            element.timeDisplay.textContent = `=> ${durationStr}`;
        }

        set.interval(() => {
            /**@type {NodeListOf<CustomYoutubeVideoElement>} */
            let elements = document.querySelectorAll('ytd-grid-video-renderer,ytd-item-section-renderer.ytd-section-list-renderer,ytd-rich-item-renderer');
            //
            Promise.all([...elements].map(async el => checkTime(el)));

        }, 1000);

    },
    reset: (set) => {
        //
    }
});