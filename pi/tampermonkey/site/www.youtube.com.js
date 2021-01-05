/*global IMPORT,handleError,sc */
/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />
/// <reference path="../time.js" />
/**
 * @typedef {HTMLDivElement & {
*  videohref:String,
*  autoScrollButton:HTMLElement&{timestmap?:HTMLDivElement},
*  currentIndex:number,
*  wentLiveDate:Date
*  origWentLive:string
* }} CustomYoutubeVideoElement
*
*/
/**@type {CustomHTMLscript} */
var youtubeScript = document.currentScript;
youtubeScript.isModular = true;
var createdElements = [];
youtubeScript.reset = () => {
    sc.menu.removeByName('scroll');
    for(let btn of createdElements) {
        try {
            btn.remove();
        } catch(e) {
            console.log(e);
        }
    }
};

(async () => {

    /**
    * @type {[StorageImplementationType<'mostRecentVideo',string>,CustomTimeClass,unknown]}
    */
    const [localStorage, time, _] = await reqS([
        'Storage/localStorage', 'time', 'DOM/button'
    ]);

    const youtubemostrecent = 'mostRecentVideo';

    if(location.href.includes('https://www.youtube.com/feed/subscriptions')) {

        scroll(
            //menuElementYoutubeIndex
        );

        /**@type {CustomSlider} */
        let rotationSlider;
        let currentPercent = 0;
        sc.menu.addToMenu({
            name: 'scroll',
            mouseOver: scroll,
            creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu) => {
                const button = menu.createElement(parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu);
                rotationSlider = new CustomSlider(parent, center, undefined, (1 - currentPercent) * 100, {
                    scale: 0.5,
                    color: 'red',
                    arcWidth: 7,
                    viewRotation: 90 + angle
                });
                rotationSlider.container.style.zIndex = '2199999999';
                return button;
            },
        });
        time.waitFor({
            duration: 1000 * 60 * 60,
            timeout: 500,
            callback: () => location.reload(),
            onStep: (percent) => {
                if(rotationSlider) {
                    rotationSlider.setPercent(1 - percent);
                    rotationSlider.blink();
                }
            }
        });
        /**@type {NodeListOf<CustomYoutubeVideoElement>} */
        let elements = document.querySelectorAll('ytd-item-section-renderer.ytd-section-list-renderer');
        const previousChecked = sc.G.filter('delayedYoutubeCheck', StorageImplementation.filterDaysFunction(14));
        for(let el of elements) {
            if(el.querySelector('#metadata-line')) {
                checkTime(el);
                const channel = el.querySelector('#title-text')
                    .textContent
                    .trim();
                const title = el.querySelector('#title-wrapper')
                    .textContent
                    .trim();
                await sc.g.a('ytd-thumbnail-overlay-time-status-renderer', el);
                const duration = el.querySelector('ytd-thumbnail-overlay-time-status-renderer')
                    .textContent
                    .trim();
                const durationtime = durationStrToSeconds(duration);
                /**
                 * @type {HTMLAnchorElement}
                 */
                const linkElement = el.querySelector('a#thumbnail');

                if(durationtime > 7200
                    && !previousChecked.find(o => o.value === linkElement.href)) {
                    /**
                     * @type {HTMLImageElement}
                     */
                    const img = el.querySelector('#thumbnail img');
                    GMnot({
                        title: 'adding video for weekend ?',
                        body: `${title}\nfrom ${channel}`,
                        timeout: 12000,
                        image: img.src,
                        onclick: () => {
                            sc.G.p('delayedYoutube', { title, url: linkElement.href });
                        }
                    });
                    const overlay = document.createElement('div');
                    overlay.style.position = 'relative';
                    overlay.style.backgroundColor = '#d4d4d4ba';
                    overlay.style.zIndex = '9999999';
                    // @ts-ignore
                    const height = el.getComputedStyleValue('height');
                    overlay.style.height = height;
                    overlay.style.marginTop = '-' + height;
                    el.appendChild(overlay);

                }
                sc.G.p('delayedYoutubeCheck', {
                    value: linkElement.href,
                    timestamp: Date.now()
                });

                if(el.querySelector('.ytd-thumbnail-overlay-resume-playback-renderer')) {
                    debugger;
                    break;
                }
            }

        }
    } else {
        /**@type {NodeListOf<CustomYoutubeVideoElement>} */
        let elements = document.querySelectorAll('ytd-grid-video-renderer');
        for(let el of elements) {
            checkTime(el);
        }
    }

    function durationStrToSeconds(durtationStr) {
        const multipliers = [1, 60, 60 * 60];
        const parts = durtationStr.split(':')
            .reverse();
        return parts.reduce((previous, currentElement, index) => {
            return (+currentElement) * multipliers[index] + previous;
        }, 0);
    }

    function scroll(menuElementYoutubeIndex) {
        async function checklength() {
            console.log('awaiting progress info');
            let vid = await sc.g.a('ytd-thumbnail-overlay-resume-playback-renderer');
            if(vid) {
                scrollToLastSeen(menuElementYoutubeIndex);
            }
        }
        checklength();
    }
    function scrollToLastSeen(menuElementYoutubeIndex) {
        console.log('searching for last checked');
        /**@type {Array<CustomYoutubeVideoElement>} */
        let list = sc.g('contents').children;
        let toscroll = localStorage.g(youtubemostrecent, '');
        let seen = false;
        if(list.length > 20) {
            for(let i = 0; i < list.length; i++) {
                try {
                    /**@type { CustomYoutubeVideoElement } */
                    const current = list[i];
                    let vidobj = sc.g('ytd-thumbnail-overlay-resume-playback-renderer', current);
                    current.videohref = sc.g('yt-simple-endpoint ytd-thumbnail', current).href;
                    current.currentIndex = i;

                    if(vidobj || current.videohref === toscroll) {
                        seen = true;
                        current.autoScrollButton = crIN(current, 'seen3', undefined, undefined, undefined, undefined, {
                            style: {
                                left: current.offsetLeft - 100 + 'px',
                                top: (current.offsetTop + 80) + 'px',
                                backgroundColor: 'green',
                                position: 'absolute',
                                width: '60px',
                                height: '100px'
                            }
                        });
                        createdElements.push(current.autoScrollButton);
                        console.log('scrolling to last checked');
                        sc.g.W()
                            .scrollTo(0, current.offsetTop - 650);
                        break;
                    }
                    if(current.autoScrollButton) {
                        current.autoScrollButton.remove();
                    }
                    current.autoScrollButton = crIN(current, 'mark\nseen', (btn) => {
                        localStorage.s(youtubemostrecent, btn.parentElement.videohref);
                        for(let buttonIndex = btn.parentElement.currentIndex; buttonIndex < list.length; buttonIndex++) {
                            if(list[buttonIndex].autoScrollButton) {
                                list[buttonIndex].autoScrollButton.remove();
                            }
                        }
                    }, undefined, undefined, undefined, {
                        style: {
                            left: current.offsetLeft - 100 + 'px',
                            top: (current.offsetTop + 80) + 'px',
                            backgroundColor: 'lightgreen',
                            position: 'absolute',
                            width: '60px',
                            height: '100px'
                        }
                    });
                    createdElements.push(current.autoScrollButton);
                    checkTime(current);
                } catch(e) {
                    debugger;
                    handleError(e);
                    throw e;
                }
            }
        }
        else {
            setTimeout(scrollToLastSeen, 1000, menuElementYoutubeIndex);
        }
        if(!seen) {
            setTimeout(() => {
                for(let current of list) {
                    /**@type {HTMLElement} */
                    let ts = current.querySelector('#metadata-line > span:nth-child(2)');
                    ts.style.backgroundColor = 'transparent';
                    if(current.autoScrollButton) {
                        current.autoScrollButton.remove();
                    }
                }
                scrollToLastSeen(menuElementYoutubeIndex);
            }, 1000);
        }
    }
    /**@param {CustomYoutubeVideoElement} element */
    function checkTime(element) {
        if(!element.wentLiveDate) {
            /**@type {string} */
            const wentListString = element.querySelector('#metadata-line').children[1].textContent
                .split('vor ')[1];

            if(!wentListString) {
                setTimeout(checkTime, 1000, element);
                return;
            }
            /**@type {Number} */
            let durationOffset;
            if(wentListString.includes('Minute')) {
                durationOffset = (Number(wentListString.split(/ Minuten*/)[0]) * (1000 * 60));
            } else {
                durationOffset = (Number(wentListString.split(/ Stunden*/)[0]) * (1000 * 60 * 60));
            }
            const wentLiveDate = new Date(Date.now() - durationOffset);
            element.origWentLive = wentListString;
            element.wentLiveDate = wentLiveDate;
        }
        let duration = Math.floor((Date.now() - element.wentLiveDate.valueOf()) / 1000);
        let min = duration % 60;
        let hours = Math.floor(duration / 60);
        /**@type {HTMLElement} */
        const timeTExt = element.querySelector('#metadata-line > span:nth-child(2)');
        let durationStr = `${hours}:${min}`;
        if(durationStr.includes('NaN')) {
            durationStr = '∞';
        } else {
            timeTExt.style.backgroundColor = '#11d1ecb8';
        }
        timeTExt.textContent = `${element.origWentLive} => ${durationStr}`;
        setTimeout(checkTime, 1000, element);
    }
})();