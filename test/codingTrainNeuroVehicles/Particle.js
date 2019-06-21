/// <reference path="./Ray.js" />
/// <reference path="../codingTrainGeneticTemplate.js" />
class Particle {
    constructor() {
        this.fitness = 0;
        this.dead = false;
        this.finished = false;
        this.pos = createVector(start.x, start.y);
        this.vel = createVector();
        this.acc = createVector();
        this.maxspeed = 5;
        this.maxforce = 0.2;
        this.sight = SIGHT;

        /**
         * @type {Array<Ray>}
         */
        this.rays = [];
        this.index = 0;
        this.counter = 0;

        for (let a = -45; a < 45; a += 15) {
            this.rays.push(new Ray(this.pos, radians(a)));
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        if (!this.dead && !this.finished) {
            this.pos.add(this.vel);
            this.vel.add(this.acc);
            this.vel.limit(this.maxspeed);
            this.acc.set(0, 0);
            this.counter++;
            if (this.counter > LIFESPAN) {
                console.log('dead lifespan');
                this.dead = true;
            }

            for (let ray of this.rays) {
                ray.rotate(this.vel.heading());
            }
        }
    }

    check(checkpoints) {
        if (!this.finished) {
            this.goal = checkpoints[this.index];
            const d = pldistance(this.goal.a, this.goal.b, this.pos.x, this.pos.y);
            if (d < 5) {
                this.index = (this.index + 1) % checkpoints.length;
                this.fitness++;
                this.counter = 0;
            }
        }
    }

    calculateFitness() {
        this.fitness = pow(2, this.fitness);
        // if (this.finished) {
        // } else {
        //   const d = p5.Vector.dist(this.pos, target);
        //   this.fitness = constrain(1 / d, 0, 1);
        // }
    }

    getReward(prediction) {
        let angle = map(prediction[0], 0, 1, -PI, PI);
        let speed = map(prediction[1], 0, 1, 0, this.maxspeed);
        angle += this.vel.heading();
        const steering = p5.Vector.fromAngle(angle);
        steering.setMag(speed);
        steering.sub(this.vel);
        steering.limit(this.maxforce);
        this.applyForce(steering);
        this.check(checkpoints);
        this.bounds();
        this.update();
        this.show();
        return this.fitness;
    }
    getTensor() {
        const inputs = [];
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let closest = null;
            let record = this.sight;
            for (let wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record && d < this.sight) {
                        record = d;
                        closest = pt;
                    }
                }
            }

            if (record < 5) {
                this.dead = true;
            }

            inputs[i] = map(record, 0, 50, 1, 0);

            if (closest) {
                colorMode(HSB);
                stroke((i + frameCount * 2) % 360, 255, 255, 50);
                stroke(255);
                line(this.pos.x, this.pos.y, closest.x, closest.y);
            }
        }
        const vel = this.vel.copy();
        vel.normalize();
        //inputs.push(vel.x);
        //inputs.push(vel.y);
        return tf.tensor(inputs);
        //const output = this.brain.predict(inputs);

        // console.log(output);
    }

    bounds() {
        if (p5a.outOfBounds(this.pos)) {
            console.log('dead out of bounds');
            this.dead = true;
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        const heading = this.vel.heading();
        rotate(heading);
        fill(255, 100);
        rectMode(CENTER);
        rect(0, 0, 10, 5);
        pop();
        // for (let ray of this.rays) {
        //   // ray.show();
        // }
        if (this.goal) {
            this.goal.show();
        }
    }

    highlight() {
        push();
        translate(this.pos.x, this.pos.y);
        const heading = this.vel.heading();
        rotate(heading);
        stroke(0, 255, 0);
        fill('green');
        rectMode(CENTER);
        rect(0, 0, 20, 10);
        pop();
        for (let ray of this.rays) {
            ray.show();
        }
        if (this.goal) {
            this.goal.show();
        }
    }
}
function pldistance(p1, p2, x, y) {
    const num = abs((p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x);
    const den = p5.Vector.dist(p1, p2);
    return num / den;
}