/*global IMPORT,handleError,sc */
/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />
/// <reference path="../time.js" />

/**@type {CustomHTMLscript} */
var youtubeScript = document.currentScript;
youtubeScript.isModular = true;
var createdElements = [];
youtubeScript.reset = () => {
    sc.menu.elements = sc.menu.elements.filter(el => el.name != "scroll")
    for (let btn of createdElements) {
        try {
            btn.remove();
        } catch (e) {
            console.log(e);
        }
    }
}

(async () => {
    let Storage_localStorage = await reqS("Storage/localStorage")

    await reqS("DOM/button");
    /**
     * @type CustomTime
     */
    let time = await reqS("time");;

    const youtubemostrecent = "mostRecentVideo";

    if (location.href.includes('https://www.youtube.com/feed/subscriptions')) {


        scroll(
            //menuElementYoutubeIndex
        );

        /**@type {CustomSlider} */
        let rotationSlider;
        let currentPercent = 0;
        sc.menu.addToMenu({
            name: "scroll",
            mouseOver: scroll,
            creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu) => {
                const button = menu.createElement(parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu);
                rotationSlider = new CustomSlider(parent, center, () => { }, (1 - currentPercent) * 100, {
                    scale: 0.5,
                    color: "red",
                    arcWidth: 7
                });
                rotationSlider.container.style.zIndex = "2199999999";
                rotationSlider.setRotation(angle);//  style.transform = "rotate(" + (90 + (angle)) + "deg) translate(-24px,-24px) ";
                return button;
            },
        });
        time.waitFor({
            duration: 1000 * 60 * 60,
            timeout: 500,
            callback: window.location.reload,
            onStep: (percent) => {
                if (rotationSlider) {
                    rotationSlider.setPercent(1 - percent);
                    rotationSlider.blink();
                }
            }
        });

    }
    function scroll(menuElementYoutubeIndex) {
        async function checklength() {
            console.log('awaiting progress info');
            let vid = await sc.g.a("ytd-thumbnail-overlay-resume-playback-renderer");
            if (vid) {
                scrollToLastSeen(menuElementYoutubeIndex);
            }
        }
        checklength();
    }
    function scrollToLastSeen(menuElementYoutubeIndex) {
        console.log('searching for last checked');
        let list = sc.g("contents").children;
        let toscroll = Storage_localStorage.g(youtubemostrecent, []);
        let seen = false;
        if (list.length > 20) {
            for (let i = 0; i < list.length; i++) {
                try {
                    let vidobj = sc.g("ytd-thumbnail-overlay-resume-playback-renderer", list[i]);
                    list[i]['videohref'] = sc.g("yt-simple-endpoint ytd-thumbnail", list[i]).href;
                    list[i]['currentIndex'] = i;

                    if (vidobj || list[i]['videohref'] === toscroll) {
                        seen = true;
                        list[i]['autoScrollButton'] = crIN(list[i], "seen3", undefined, undefined, undefined, undefined, {
                            style: {
                                left: list[i]['offsetLeft'] - 100 + "px",
                                top: list[i]['offsetTop'] + 80 + "px",
                                backgroundColor: "green",
                                position: "absolute",
                                width: "60px",
                                height: "100px"
                            }
                        });
                        createdElements.push(list[i]['autoScrollButton']);
                        console.log('scrolling to last checked');
                        sc.g.W().scrollTo(0, list[i]['offsetTop'] - 650);
                        break;
                    }
                    if (list[i]['autoScrollButton']) {
                        list[i]['autoScrollButton'].remove();
                    }
                    list[i]['autoScrollButton'] = crIN(list[i], "mark\nseen", function (btn) {
                        Storage_localStorage.s(youtubemostrecent, btn.parentElement.videohref);
                        for (let i = btn.parentElement.currentIndex; i < list.length; i++) {
                            if (list[i]['autoScrollButton']) {
                                list[i]['autoScrollButton'].remove();
                            }
                        }
                    }, undefined, undefined, undefined, {
                            style: {
                                left: list[i]['offsetLeft'] - 100 + "px",
                                top: list[i]['offsetTop'] + 80 + "px",
                                backgroundColor: "lightgreen",
                                position: "absolute",
                                width: "60px",
                                height: "100px"
                            }
                        });
                    createdElements.push(list[i]['autoScrollButton']);
                } catch (e) {
                    debugger;
                    handleError(e);
                    throw e;
                }
            }
        }
        else {
            setTimeout(scrollToLastSeen, 1000, menuElementYoutubeIndex);
        }
        if (!seen) {
            setTimeout(function () {
                for (let i = 0; i < list.length; i++) {
                    if (list[i]['autoScrollButton']) {
                        list[i]['autoScrollButton'].remove();
                    }
                }
                scrollToLastSeen(menuElementYoutubeIndex);
            }, 1000);
        }
    }
})();