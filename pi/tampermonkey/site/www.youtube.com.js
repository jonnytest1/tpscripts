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
    let localStorage = await reqS('Storage/localStorage');

    await reqS('DOM/button');

    let time = await reqS('time');

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
                    arcWidth: 7
                });
                rotationSlider.container.style.zIndex = '2199999999';
                rotationSlider.setRotation(angle);//  style.transform = "rotate(" + (90 + (angle)) + "deg) translate(-24px,-24px) ";
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

    } else {
        /**@type {NodeListOf<CustomYoutubeVideoElement>} */
        let elements = document.querySelectorAll('ytd-grid-video-renderer');
        for(let el of elements) {
            checkTime(el);
        }
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
        let toscroll = localStorage.g(youtubemostrecent, []);
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