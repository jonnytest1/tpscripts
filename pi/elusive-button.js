///<reference path="tampermonkey/libs/math/vector-2d.js" />
///<reference path="tampermonkey/libs/log/logging.js" />
/**
 * @typedef {HTMLButtonElement & {
 *     setPos?:(x:number|Vector2d,y?:number)=>void
 *     pos:{x:number,y:number}
 * }} RenderedButton;
 */
onload = function elusiveButton() {

    const texts = [
        'you can do better',
        'really? thats all',
        'I dont have all day -.-',
        'y tho',
        'do u have no hoobies ?',
        '2 hours later',
        '👈 wouldve done it by now',
        'again ?',
        'next try',
        'happily ever after',
        'heres hoping',
        'not in a million years',
        'maybe next time',
        'nope not happending',
        'this`ll take a while',
        'you must be bored',
        'not today'

    ];
    /**@type {RenderedButton} */
    // @ts-ignore
    const button = document.createElement('button');
    button.textContent = 'click me :3';
    button.style.position = 'fixed';
    button.onclick = () => {
        alert('you did it :o \\o/');
        logInfo('clicked button on main page oO');
    };
    button.setPos = (x, y = 0) => {
        /**@type {number} */
        let newX;
        /**@type {number} */
        let newY;
        if(typeof x === 'object') {
            newY = x.y;
            newX = x.x;
        } else {
            newX = x;
            newY = y;
        }
        if(newX < 0 || newX > innerWidth || newY < 0 || newY > innerHeight) {
            newX = innerWidth / 2;
            newY = innerHeight / 2;
            button.textContent = texts[Math.floor(Math.random() * texts.length)];
        }

        console.log(newX, newY);
        button.style.top = newY + 'px';
        button.style.left = newX + 'px';
        button.pos = { x: newX, y: newY };
    };
    button.setPos(window.innerWidth / 2, window.innerHeight / 2);
    document.body.appendChild(button);

    onmousemove = (e) => {
        const mouseObj = { pos: e };
        let distance = Vector2d.sub(mouseObj, button);
        if(distance.length < 200) {
            console.log('closer');

            button.setPos(
                distance
                    .withMagnitude(200)
                    .add(mouseObj)
            );

        }
    };
};
