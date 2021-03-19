/// <reference path="../DOM/customSlider.js" />
/// <reference path="../DOM/CircularMenu.js" />
let currentPercent = 0;
let rotationSlider2;
let rotationSlider;
let rotationSlider3;

document.body.style.backgroundColor = 'gray';

async function alwaysActivator() {
    return new Promise(res => res());
}
async function noDeactivator() {
    return new Promise(res => { return; });
}
async function keyActivator() {
    return new Promise((resolver) => {
        function onKeyDown(event) {
            if(event.key === 'Control') {
                document.removeEventListener('keydown', onKeyDown);
                resolver(event);
            }
        }
        document.addEventListener('keydown', onKeyDown);
    });

}
async function unPressDeactivator() {
    return new Promise((resolver) => {
        function onKeyUp(event) {
            if(event.key === 'Control') {
                document.removeEventListener('keyup', onKeyUp);
                resolver(event);
            }
        }
        document.addEventListener('keyup', onKeyUp);
    });
}
reqS('DOM/CircularMenu')
    .then(resolv => {
        let testMenu = new resolv(document.body, [], {
            activator: keyActivator,
            deactivator: unPressDeactivator,
            getCenter: () => ({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                target: document.body
            })

        });

        for(let i = 0; i < 8; i++) {
            testMenu.addToMenu({
                name: 'scroll' + i,
                creationFunction: (parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu) => {
                    const button = menu.menu.createElement(parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu);
                    rotationSlider2 = new CustomSlider(parent, center, undefined, (1 - currentPercent) * 100, {
                        scale: 0.5,
                        // color: "red",
                        arcWidth: 7,
                        viewRotation: 90 + angle
                    });
                    rotationSlider2.container.style.zIndex = '2199999999';

                    return button;
                },
            });
        }

    });
