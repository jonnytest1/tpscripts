/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../DOM/customSlider.js" />
/// <reference path="../customTypes/localhost.d.ts" />
/// <reference path="../libs/math/vector-2d.js" />

/**
 * @type {EvalScript<{
 * dialogInstance:Dialog,
 * open:HTMLElement,
 * table:DOMTable}>}
 */
var ev = new EvalScript('', {
    run: async (res, set) => {
        //await reqS("learning/tensorflow");
        // await reqS('DOM/customSlider');
        //await reqT("video")
        await reqS('site/kissanime/buildModel');
        //await reqT('multiplemenu');
        // await reqS("DOM/rectMenu")
        // await reqT("ngtest");
        document.body.style.background = 'linear-gradient(to right,orange,blue,green)';
        // const dialog = await reqS('DOM/dialog');
        //const table = await reqS('DOM/table');

    },
    reset: (set) => {
        //
    }
});

(async function localhost() {

    //await reqT("shootergame")
    // await reqT("codingTrainGeneticTemplate");
    //await reqT("genetic")
    /* await reqS('libs/math/vector-2d');

     window['debug'] = true;
     //await reqS("graphics/p5import");
     let sliders = [];
     let rotation = 0;

     let scaleDif = 1;
     let var1;
     let var2 = 0;
     createTestSliders(ranges => {
         var1 = ranges[0];
         var2 = ranges[1];
         createSliders(var1, var2);
     }, { amount: 2 });

     /*setInterval(() => {
          rotation += 2;

      }, 100);

     //createSliders(1, rotation);

     new CustomSlider(document.body, { x: 500, y: 500 }, value => {
         //  console.trace(value);
     }, Math.sqrt(0.5 * 2500), {
         mapping: percent => {
             var speed = (percent / 50) * (percent / 50);
             if(percent < 2) {
                 speed = -0.5;
             }
             return speed;
         }
     });

     function createSliders(scale, rotationOffset = 0) {
         sliders.forEach(slider => slider.remove());
         sliders = [];

         let row = 1;
         const amount = 1;
         const rowOff = 2;
         for(let x = 0; x < amount; x++) {
             let angle = (360 * (x) / 4) + rotationOffset;
             // console.log(angle);
             let object = new CustomSlider(document.body, new Vector2d(300 + (x % rowOff) * 200, 50 + 200), () => null, 0, {
                 scale,
                 viewRotation: angle
             });

             sliders.push(object);
             if((x + 1) % rowOff === 0) {
                 row++;
             }
             if((x + 1) % 4 === 0) {
                 scale++;
             }
         }
     }*/

})();

window.setups = [];

window.draws = [];
window.keyPresseds = [];
window.mousePresseds = [];

console.log('loaded');
var cycles = 1;
var afterSetup = false;

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

    for(let setupInstance of setups) {
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
                return object.container;
            }
        }]
    });
    afterSetup = true;
};
window.draw = () => {
    if(!afterSetup) {
        return;
    }
    for(let n = 0; n < cycles; n++) {
        clear();
        draws.forEach(d => d());

        if(draws.length === 1) {
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
    /**@type { keyof import('../libs/require').RequireMap}  */
    // @ts-ignore
    let reqPath = 'test/' + path;
    return reqS(reqPath);
}

window.reqT = reqT;
/**
 *
 * @param {*} callback
 * @param {{
 *    amount?:number
 *    initialValue?:number
 * }} [options]
 */
function createTestSliders(callback, options = {}) {
    const n = options.amount || 1;
    const value = options.initialValue || 0;
    /**
     * @type {Array<HTMLInputElement>}
     */
    const sliders = [];
    for(let i = 0; i < n; i++) {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.style.position = 'fixed';
        slider.style.left = '50%';
        slider.style.top = i * 30 + 'px';
        slider.style.transform = 'scaleX(6)';
        slider.valueAsNumber = value;
        slider.oninput = () => {
            callback(sliders.map(sliderRef => +sliderRef.value));
        };
        document.body.appendChild(slider);
        sliders.push(slider);
    }
}
