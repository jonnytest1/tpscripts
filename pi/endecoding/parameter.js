
export class Parameter {
    /**
     *
     * @param {number} [xIndex]
     * @param {string} [param]
     */
    constructor(xIndex, param) {
        if(xIndex) {
            this.xIndex = xIndex;
        }
        if(param) {
            if(param.includes('_')) {
                this.yIndex = param.split('_')[0];
                this.value = param.split('_')[1];
            } else {
                this.yIndex = param;
            }
        }
    }

    valueOf() {
        return this.yIndex;
    }

    toString() {
        if(this.value) {
            return `${this.yIndex}_${this.value}`;
        } else {
            return '' + this.yIndex;
        }
    }

    /**
     *
     * @param {*} xIndex
     * @param {*} yIndex
     * @param {any} queryPicked
     * @param {any} [value]
     */
    static setIndex(xIndex, yIndex, queryPicked, value) {
        if(!queryPicked[xIndex]) {
            queryPicked[xIndex] = new Parameter();
        }
        if(yIndex) {
            if(queryPicked[xIndex].yIndex !== yIndex) {
                //queryPicked[xIndex].value = undefined;
            }
            queryPicked[xIndex].yIndex = yIndex;

        }
        if(value) {
            queryPicked[xIndex].value = value;
        }

    }
}