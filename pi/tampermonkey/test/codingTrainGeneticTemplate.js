/// <reference path="../site/localhost.js" />
/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../learning/tensorflow.js" />
/// <reference path="./codingTrainNeuroVehicles/Particle.js" />
/// <reference path="./codingTrainNeuroVehicles/Track.js" />
/// <reference path="./codingTrainNeuroVehicles/Boundary.js" />
const TOTAL = 100;
const MUTATION_RATE = 0.1;
const LIFESPAN = 50;
const SIGHT = 50;
let generationCount = 0;

/**
 * @type {Boundary[]}
 */
let walls = [];
let ray;

let speedSlider;

let inside = [];
let outside = [];
let checkpoints = [];
let savedParticles = [];
let start, end;

/**
 * @type NeuralGeneration<Particle>
 */
let neuralGen;

setups.push(async (width, height) => {
    await reqT('codingTrainNeuroVehicles/Boundary');
    await reqT('codingTrainNeuroVehicles/Particle');
    await reqT('codingTrainNeuroVehicles/Ray');
    await reqT('codingTrainNeuroVehicles/Track');

    tf.setBackend('cpu');
    createCanvas(width, height);

    buildTrack();

    neuralGen = new NeuralGeneration(10, () => new Particle(), 10);
});

let bestCar;

draws.push(function geneticCarCodingTrain() {
    background(0);

    neuralGen.frame({
        shouldPredict: (obj) => {
            return !obj.dead && !obj.finished;
        },
        afterEach: object => object.show(),
        forBest: object => object.highlight()

    });
    const objects = neuralGen.objects;
    if (objects.every(obj => obj.dead || obj.finished)) {
        buildTrack();

        neuralGen.nextGeneration({
            fitnessFucntion: (obj) => pow(2, obj),
            reset: (p, m) => {
                let object = p;
                object.dead = false;
                object.finished = false;
                object.fitness = 0;
                object.pos.set(start.x, start.y);
                object.vel.set(0, 0);
                object.acc.set(0, 0);
                object.counter = 0;
                object.index = 0;
                object.goal = checkpoints[object.index];

            }
        });

        generationCount++;
    }
    /*for (let cp of checkpoints) {
        strokeWeight(2);
        cp.show();
    }*/

    for (let wall of walls) {
        wall.show();
    }

    fill(255);
    textSize(24);
    noStroke();
    text('generation ' + generationCount, 10, 50);
    //fill("blue");
    //p5a.crcl(bestCar, 40);

});

mousePresseds.push((x, y) => {
    return;
});