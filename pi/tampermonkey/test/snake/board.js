/// <reference path="./game.js"/>
class Board {

    constructor(x, y) {
        this.fieldWith = canvasWidth / x;
        this.fieldHeight = canvasHEight / y;
        this.x = x;
        this.y = y;
        /**@type {Field[][]} */
        this.fields = [];
        this.createBoard();
    }

    createBoard() {
        this.fields = [];
        for (let i = 0; i < this.x; i++) {
            this.fields[i] = [];
            for (let j = 0; j < this.y; j++) {
                this.fields[i][j] = new Field(i, j, this.fieldWith, this.fieldHeight);
            }
        }
    }

    /**
     *
     * @param {(field:Field)=>void} callback
     */
    forEachField(callback) {
        for (let row of this.fields) {
            for (let field of row) {
                callback(field);
            }
        }
    }

    /**
     * @param {Snake} snake
     * */
    checkCollision(snake) {
        this.forEachField(f => {
            if (f.isFood && f.collides(snake)) {
                snake.add();
                f.isFood = false;
                this.setFood();
            }
        });
    }
    /**
     *
     * @param {Snake} snake
     */
    draw(snake) {
        this.forEachField(f => f.draw());
    }

    setFood() {
        rnd(rnd(this.fields))
            .setFood();
    }

}

class Field {
    constructor(iX, iY, width, height) {
        /**@type {import('p5').Vector} */
        this.pos = createVector(iX * width, iY * height);
        this.width = width;
        this.height = height;
        this.index = createVector(iX, iY);
        this.isFood = false;
    }
    draw() {
        if (this.isFood) {
            fill('red');
            rct(this.pos, this.width, this.height);
        } else {
            fill('white');
            rct(this.pos, this.width, this.height);
        }

    }
    /**
    *
    * @param {Snake} snake
    */
    collides(snake) {
        return snake.positions.some(pos => pos.equals(this.index));
    }

    setFood() {
        this.isFood = true;
    }
}