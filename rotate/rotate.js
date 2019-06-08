/* global INJECT,sc */
/// <reference path="../customTypes/rotate.d.ts" />


(async () => {

    await reqS("DOM/customSlider");

    let now = () => new Date().valueOf();

    document.title = "ROTATE " + document.title;

    let NEXTURL = INJECT;
    let LENGTH = INJECT;
    let URLS = INJECT;

    /**@type {CustomSlider} */
    let rotationSlider;
    let currentPercent = 0;

    sc.menu.addToMenu({
        name: "rotate",
        creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu) => {
            const button = menu.createElement(parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu);
            rotationSlider = new CustomSlider(parent, center, () => { }, (1 - currentPercent) * 100, {
                scale: 0.5,
                color: "red",
                arcWidth: 7,
                skipMouseMove: true
            });
            rotationSlider.container.style.zIndex = "2199999999";
            rotationSlider.setRotation(angle);
            return button;
        },
        children: URLS.map(URL => ({
            name: URL,
            mouseOver: () => {
                location.href = URL;
            }
        }))
    });

    sc.menu.addToMenu({
        name: "next",
        mouseOver: () => location.href = NEXTURL
    }, el => el.find(l => l.name == "rotate"));

    function progressOverlayRegression(element, duration, url, startTime = now()) {
        let progressedDuration = now() - startTime;
        let percent = 1 - (progressedDuration / duration);
        currentPercent = percent;
        if (percent > 0) {
            if (rotationSlider) {
                rotationSlider.setPercent(1 - percent);
                rotationSlider.blink();
            }
            setTimeout(progressOverlayRegression, 500, element, duration, url, startTime);
        }
        else {
            //if (sc.S.g(sc.c.sI.SS.timer_checking, 0) === 0 && sc.S.g(sc.c.sI.SS.timer_paused, 0) === 0) {
            location.href = url;
            // }
            // else {
            //m4.parent.childNodes[0].textContent = "delayed 30 secs " + sc.T.D(now()).split(", ")[1];
            //     console.log("delayed next url :" + (sc.S.g(sc.c.sI.SS.timer_paused, 0) === 0 ? "checking" : "blocked"));
            //     setTimeout(progressOverlayRegression, 100, element, 1000 * 30, url);
            // }
        }
    }
    progressOverlayRegression(null, 1000 * 60 * LENGTH, NEXTURL);
    //lets see if this survives hibernate
    setTimeout(progressOverlayRegression, 1000 * 60 * 60 * 8, null, 1, NEXTURL);
})();




