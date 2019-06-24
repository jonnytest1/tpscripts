class Snake {

    constructor() {
        this.length = 1;

        /**@type {Array<import('p5').Vector>} */
        this.positions = [createVector(20, 20)];
        /**@type {import('p5').Vector} */
        this.direction = createVector(1, 0);
        this.animationState = 0;
        this.maxAnimationState = 5;
    }
    add() {
        this.positions.push(this.positions[this.positions.length - 1].copy());
    }
    animVec() {
        return this.direction.copy()
            .mult(this.animationState / this.maxAnimationState);
    }
    update() {
        if (this.animationState >= this.maxAnimationState) {
            this.animationState = 0;
        }
        if (this.animationState === 0) {
            this.positions.unshift(this.positions[0].copy()
                .add(this.direction.copy()));
            this.positions.pop();
            if (this.isColliding()) {
                createGame();
                return false;
            }
        }
        this.animationState++;
        this.setDirection();
    }

    isColliding() {
        for (let i = 0; i < this.positions.length; i++) {
            for (let j = 0; j < this.positions.length; j++) {
                if (j !== i && this.positions[j].equals(this.positions[i])) {
                    debugger;
                    return true;
                }
            }
        }
        let newest = this.positions[0];
        if (newest.x < 0 || newest.y < 0) {
            return true;
        } else if (newest.x > board.x || newest.y > board.y) {
            return true;
        }
        return false;
    }

    draw() {
        for (let i = 0; i < this.positions.length; i++) {
            let obj = this.positions[i];

            let animationVec = this.animVec();
            if (i > 0) {
                animationVec = this.positions[i - 1].copy()
                    .sub(obj.copy())
                    .mult(this.animationState / this.maxAnimationState);
            }
            let offsetVector = createVector((obj.x + animationVec.x) * board.fieldWith, (obj.y + animationVec.y) * board.fieldHeight);
            fill('green');
            rct(offsetVector.copy()
                , board.fieldWith, board.fieldHeight);
        }

    }

    setDirection() {
        let direction = this.direction;
        if (keyDown(65) || keyDown(37)) {
            direction = createVector(-1, 0);
        }

        if (keyDown(83) || keyDown(40)) {
            direction = createVector(0, 1);
        }

        if (keyDown(68) || keyDown(39)) {
            direction = createVector(1, 0);
        }

        if (keyDown(87) || keyDown(38)) {
            direction = createVector(0, -1);
        }
        this.direction = direction;

    }
}