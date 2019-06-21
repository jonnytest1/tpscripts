/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />
/// <reference path="../customTypes/localhost.d.ts" />
(async function localhost() {
    await reqS('DOM/dependencyCheck');
    //await reqS("learning/tensorflow");
    //await reqS("DOM/customSlider");
    //await reqT("video")
    await reqS('site/kissanime/buildModel');
    //await reqT("multiplemenu")
    // await reqS("DOM/rectMenu")
    // await reqT("ngtest");

    //await reqT("shootergame")
    // await reqT("codingTrainGeneticTemplate");
    //await reqT("genetic")

    //await reqS("graphics/p5import");

})();

window.setups = [];

window.draws = [];
window.keyPresseds = [];
window.mousePresseds = [];

console.log('loaded');
let cycles = 1;
let afterSetup = false;

/**
* width in canvas
* @type {number}
* @global
*/
var frameWidth = window.innerWidth - 8;
/**
* height in canvas
* @type {number}
*/
var frameHeight = window.innerHeight - 8;

window.setup = async () => {

    await p5a.await();

    console.log('root setup');

    for (let setupInstance of setups) {
        await setupInstance(frameWidth, frameHeight);
    }

    const style = document.createElement('style');
    style.innerHTML = '.p5Canvas{border:black 2px solid;}';
    document.head.appendChild(style);
    document.body.style.marginLeft = '0px';

    background('white');

    sc.menu.addToMenu({
        name: 'speed',
        children: [{
            creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, st, center, angle) => {
                let object = new CustomSlider(parent, center, (percent) => {
                    cycles = percent / 10;
                }, cycles * 10);
                object.container.style.backgroundColor = '#ffffff6e';
                object.setRotation(angle);
                return object;
            }
        }]
    });
    afterSetup = true;
};
window.draw = () => {
    if (!afterSetup) {
        return;
    }
    for (let n = 0; n < cycles; n++) {
        clear();
        draws.forEach(d => d());

        if (draws.length === 1) {
            textSize(32);
            fill(50);
            text(draws[0].name, 10, 25);

        }
    }

};
window.keyPressed = () => {
    keyPresseds.forEach(k => k(event));
};
window.mousePressed = () => {
    mousePresseds.forEach(m => m(mouseX, mouseY));
};
async function reqT(path) {
    return reqS('test/' + path);
}

window.reqT = reqT;
