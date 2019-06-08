/// <reference path="../customTypes/index.d.ts" />

const amount = 60;

//let objects = [];



//let models = [];

var target;

let startpoint;

/**
 * @type NeuralGeneration
 */
let neuralGen;


class car {

    constructor(i) {
        this.index = i;
        this.reset(createVector(Math.random() * width, Math.random() * height));
        this.color = "red";
    }
    draw() {
        if (this.line) {
            p5a.ln(this.position, this.line);
        }
        fill(this.color);
        p5a.crcl(this.position, 10);

    }

    getTensor() {
        const tensor = tf.tensor1d([target.x - this.position.x, target.y - this.position.y]);
        //   debugger;
        return tensor;
    }

    getReward(prediction) {
        const angle = map(prediction[0], 0, 1, -PI, PI);
        // console.log(angle / (PI / 180));
        const directionVector = p5.Vector.fromAngle(angle);
        const resultVec = directionVector.normalize().mult(6);

        this.line = p5.Vector.add(this.position, directionVector.copy().normalize().mult(40));
        this.position.add(resultVec);
        // console.log(this.index + " at " + this.position)

        const startToFinsih = p5.Vector.sub(startpoint, target);

        const toTarget = p5.Vector.sub(target, this.position);

        const reward = Math.max(startToFinsih.mag() - toTarget.mag(), 0);



        if (p5.Vector.dist(this.position, target) < 10) {
            this.score += 1000;
            this.reached = true;
            this.finished = true;
        }
        if (p5a.outOfBounds(this.position)) {
            this.finished = true;
        }
        // const reward = this.score + p5.Vector.sub(p5.Vector.sub(this.startpoint, target), p5.Vector.sub(this.position, target)).mag();
        return reward;
    }

    reset(start) {
        this.score = 0;
        this.startpoint = start;
        this.position = this.startpoint.copy();
        this.reached = false;
        this.finished = false;
    }
}
setups.push((width, height) => {
    tf.setBackend('cpu')
    createCanvas(width, height);
    startpoint = createVector(width / 2, height / 2);

    target = createVector(width / 2, height);
    neuralGen = new NeuralGeneration(amount, () => {
        const carO = new car();
        carO.position = startpoint.copy();
        return carO;
    }, 10);

    for (let i = 0; i < amount; i++) {
        //objects.push(new car(i));
        //models.push(NeuralWrapper.denseFromExample(tf.tensor1d([1, 3, 4, 5]), 5, 1))
    }
    //target = createVector((width / 4) + (Math.random() * width / 2), (height / 4) + (Math.random() * height / 2));

})

let animCount = 0;

let bests = [];

draws.push(function genetic() {
    fill(50);
    p5a.crcl(target, 20);

    neuralGen.frame({
        /**
         * @param {car} car
         */
        shouldPredict: (car) => {
            return !car.reached && !car.finished
        },
        /**
         * @param {car} object
         */
        afterEach: (object) => {
            object.draw();
        }
    });

    /*for (let i = 0; i < amount; i++) {
        let car = objects[i];
        let model = models[i];
        /*if (i == 0) {
            console.log(i + " " + model.model.getWeights()[0].dataSync()[0])
        }*
        if (!car.reached && !car.finished) {
            model.predict(car);
            // car.predict(model, target.copy());
        }
        car.draw();
    }*/

    animCount++

    /**
     * @type { Array<car> }
     */
    // @ts-ignore
    const objects = neuralGen.objects
    if (objects.every(t => t.finished) || animCount > 300) {

        animCount = 0;

        let best;
        let bestP = -1;
        for (let i = 0; i < amount; i++) {
            if (!best || neuralGen.models[i].score > best.score) {
                best = neuralGen.models[i];
                bestP = objects[i].position.copy();
            }
            objects[i].reset(startpoint.copy());
        }
        bests[0] = bestP;
        target = createVector(Math.random() * width, Math.random() * height);

        neuralGen.nextGeneration()
        // models = NeuralWrapper.nextGeneration(models)
        //startpoint = createVector(Math.random() * width, Math.random() * height);

        for (let i = 0; i < amount; i++) {
            objects[i].reset(startpoint.copy());
        }
    }

    bests.forEach(b => {
        fill("blue");
        p5a.crcl(b, 40);
    })
})

mousePresseds.push((x, y) => {

})