/// <reference path="../customTypes/index.d.ts" />
class Triangle {
    constructor(point, height) {
        this.position = point;
        this.height = height;
    }
    draw() {
        this.point2 = p5.Vector.add(this.position, createVector(this.height / 2, - this.height));
        this.point3 = window.p5.Vector.add(this.position, createVector(-this.height / 2, -this.height));
        fill('black');
        p5a.tr(this.position, this.point2, this.point3);
    }
    move(vec) {
        this.position.add(vec);
    }
    isInside(point) {
        const area = this.calculateArea(this.position, this.point3, this.point2);

        const area1 = this.calculateArea(this.position, point, this.point2);
        const area2 = this.calculateArea(this.position, point, this.point3);
        const area3 = this.calculateArea(this.point3, point, this.point2);

        if (Math.abs((area1 + area2 + area3) - area) < 0.01) {
            return true;
        }
        return false;
    }

    calculateArea(point1, point2, point3) {
        return Math.abs((point1.x * (point2.y - point3.y)) + (point2.x * (point3.y - point1.y)) + (point3.x * (point1.y - point2.y))) / 2;
    }

    isOutOfHeight = height => this.position.y > height;
}

class Enemy {

    constructor(left, type) {
        this.speed = 2;
        this.type = type;
        this.shape = new Triangle(createVector(left, -40), 60);
    }

    draw() {
        this.shape.move(createVector(0, this.speed));
        this.shape.draw();
    }

    isColliding(point) {
        return this.shape.isInside(point);
    }
    isOutOfHeight(height) {
        return this.shape.isOutOfHeight(height);
    }
    diff(ship) {
        return ship.position.x - this.shape.position.x;
    }

    isRight(ship) {
        return this.diff(ship) < -10;
    }
    isLeft(ship) {
        return this.diff(ship) > 10;
    }
}
class Projectile {

    constructor(pos) {
        this.position = createVector(pos.x, pos.y);
        this.height = 10;
        this.width = 1;
        this.speed = 8;
    }

    draw() {

        this.position.add(createVector(0, -this.speed));
        if (this.position.y < 0) {
            return false;
        }
        p5a.rct(this.position, this.width, this.height, 20);
        return true;
    }

    isColliding(enemy) {

        if (p5.Vector.sub(this.position, enemy.position)
            .mag() > this.height + enemy.size) {
            return false;
        }
        let points = [
            p5.Vector.add(this.position, createVector(0, this.height)),
            p5.Vector.add(this.position, createVector(this.width, this.height)),
            p5.Vector.add(this.position, createVector(0, 0)),
            p5.Vector.add(this.position, createVector(this.width, 0))
        ];
        for (let point of points) {
            if (enemy.isColliding(point)) {
                return true;
            }
        }
        return false;

    }

}
class Ship {

    constructor(x, y) {
        this.size = 20;
        this.speed = 10;
        this.position = createVector(x, y);
        this.projectiles = [];

    }

    isColliding(enemy) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            if (this.projectiles[i].isColliding(enemy)) {
                this.projectiles.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    draw() {
        if (keyIsDown(65)) {
            this.moveLeft();
        } else if (keyIsDown(68)) {
            this.moveRight();
        }
        if (keyIsDown(32)) {
            //
        }
        const point2 = window.p5.Vector.add(this.position, createVector(this.size / 2, this.size));
        const point3 = window.p5.Vector.add(this.position, createVector(-this.size / 2, this.size));
        fill('black');
        p5a.tr(this.position, point2, point3);

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            if (!p.draw()) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    moveRight() {
        this.position.add(createVector(this.speed, 0));
    }
    moveLeft() {
        this.position.add(createVector(-this.speed, 0));
    }
    shoot() {
        this.projectiles.push(new Projectile(this.position));
    }
}

let spaceShip;
let enemies = [];

let mlModel;
setups.push((width, height) => {
    console.log('setup start');

    createCanvas(width, height);

    mlModel = tf.sequential();

    const dataArray = getImageData(width, height);

    mlModel.add(tf.layers.conv2d({
        inputShape: dataArray.shape,
        kernelSize: 5,
        filters: 10,
        strides: 4,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'

    }));

    mlModel.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    mlModel.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
    }));
    mlModel.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    mlModel.add(tf.layers.flatten());
    mlModel.add(tf.layers.dense({
        units: 6,
        kernelInitializer: 'VarianceScaling',
        activation: 'sigmoid'
    }));

    const LEARNING_RATE = 0.15;
    const optimizer = tf.train.sgd(LEARNING_RATE);
    mlModel.compile({
        optimizer: optimizer,
        loss: 'meanSquaredError',
        metrics: ['accuracy'],
    });

    spaceShip = new Ship(width / 2, height - 40);
    console.log('setup end');
    frameRate(3000000);
});
draws.push(async function shootergame() {
    if (!mlModel || (!window.p5)) {
        return;
    }
    let imageDAta = tf.tidy(() => {
        const imgD = getImageData(width, height);
        return imgD.reshape([-1, ...imgD.shape]);
    });
    const prediction = mlModel.predict([imageDAta])
        .dataSync();

    debugger;
    if (prediction[0] > 0.8) {
        spaceShip.moveLeft();
    } else if (prediction[0] < 0.2) {
        spaceShip.moveRight();
    }
    if (prediction[2] > 0.8) {
        spaceShip.shoot();
    }

    spaceShip.draw();

    if (Math.random() > 0.98 || enemies.length === 0) {
        //enemies.push(new Enemy(0.5 * width, Math.random()));
        enemies.push(new Enemy(Math.random() * width, Math.random()));
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].draw();
        if (spaceShip.isColliding(enemies[i])) {
            enemies.splice(i, 1);
        } else if (enemies[i].isOutOfHeight(height)) {
            let e = enemies[i];

            if (e.isRight(spaceShip)) {
                const xy = tf.tensor([[0, 1, 1]]);
                await mlModel.fit([imageDAta], xy);
                xy.dispose();
            } else if (e.isLeft(spaceShip)) {
                const xy = tf.tensor([[1, 0, 1]]);
                await mlModel.fit([imageDAta], xy);
                xy.dispose();
            } else {
                const xy = tf.tensor([[-1, -1, 1]]);
                await mlModel.fit([imageDAta], xy);
                xy.dispose();
            }
            enemies.splice(i, 1);
        }

    }
    imageDAta.dispose();
    //console.log("test");
});
keyPresseds.push((keyEvent) => {
    if (keyEvent.code === 'Space') {
        spaceShip.shoot();
    }
});

function getImageData(width, height) {
    /**
     * @type {HTMLCanvasElement} canvas
     */
    // @ts-ignore
    const canvas = document.getElementById('defaultCanvas0');
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, width, height);
    return tf.browser.fromPixels(canvas);
    /*let scaleSize = 4;
    dataArray = [];
    for (let j = 0; j < imageData.height - scaleSize; j += scaleSize) {
        let column = [];
        for (let i = 0; i < imageData.width - scaleSize; i += scaleSize) {
            let sum = 0;
            let amount = 0;
            for (let x = 0; x < scaleSize; x++) {
                for (let y = 0; y < scaleSize; y++) {
                    var index = ((i + x)) * imageData.width + ((j + y));
                    var red = imageData.data[index];
                    var green = imageData.data[index + 1];
                    var blue = imageData.data[index + 2];
                    if (blue != undefined && red != undefined && green != undefined) {
                        amount++;
                        sum += (red + green + blue) / 3;

                    }

                }
            }
            if (amount == 0) {
                debugger;
            }
            column.push(Math.round(sum / amount) / 255);
        }
        dataArray.push(column)
    }
    return dataArray;*/
}
