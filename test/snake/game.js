/// <reference path="../../customTypes/index.d.ts" />
/// <reference path="./snake.js" />
const canvasWidth = window.innerWidth - 20;
const canvasHEight = window.innerHeight - 20;
const rct = (pos, width, height, ...args) => { rect(pos.x, pos.y, width, height, ...args); };
let keyCodePressed = 0;
const keyDown = (code) => {
    return keyIsDown(code) || code === keyCodePressed;
};
/**
 * @template T
 * @param {Array<T>} ar
 * @returns {T}
 */
const rnd = (ar) => {
    //
    return random(ar);
};
/**@type Board */
let board;
/**@type {Snake} */
let snake;

/**@type NeuralWrapper */
let tfModel;
function setup() {
    noStroke();
    createCanvas(canvasWidth, canvasHEight);
    background(153);
    createGame();

    tfModel = NeuralWrapper.convFromExample(getTensor(), 200, 4);
    tfModel.compile({
        optimizer: 'sgd',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });
    frameRate(120);
}

function createGame() {
    board = new Board(100, 50);
    board.setFood();
    snake = new Snake();
}
let tensors = Array(10);
function draw() {
    board.draw(snake);
    let length = snake.positions.length;
    board.checkCollision(snake);
    const grew = snake.positions.length > length;
    const reset = snake.update();
    snake.draw();

    if (tfModel) {
        const t = getTensor();
        let prediction = tfModel.predict(t);

        let max = 0;
        let maxI = -1;
        for (let i = 0; i < prediction.length; i++) {
            if (max === 0 || prediction[i] > max) {
                max = prediction[i];
                maxI = i;
            }
        }

        if (max > 0.7) {
            switch (maxI) {
                case 0:
                    keyCodePressed = 37;
                    break;
                case 1:
                    keyCodePressed = 38;
                    break;
                case 2:
                    keyCodePressed = 39;
                    break;
                case 3:
                    keyCodePressed = 40;
                    break;
                default:
                    keyCodePressed = -1;
            }
        }
        if (reset === false) {
            noLoop();
            console.log('fit');
            fit()
                .then(() => {
                    loop();
                    console.log('continue');
                });

        }

        tensors.push({ tensor: t, choice: maxI });
        let rem = tensors.shift();
        if (rem) {
            rem.tensor.dispose();
        }

    }
}
async function fit() {
    for (let pt of tensors) {
        let pred = [1, 1, 1, 1];
        pred[pt.choice] = 0;
        await tfModel.fit(pt.tensor, pred, { epochs: 10 });
    }
}
function getTensor() {
    return tf.browser.fromPixels(document.querySelector('#defaultCanvas0'));
}