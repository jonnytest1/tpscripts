
class CustomTime {
    constructor() {
        this.n = () => new Date().valueOf();
    }

    /**
     * @param {{
     * startTime?: Number, 
    * duration: Number,
    * callback:Function,
    * timeout?:number,
    * onStep?:(percent:number)=>void}} obj
    * 
    */
    waitFor(obj) {
        if (!obj.startTime) {
            obj.startTime = new Date().valueOf();
        }
        if (!obj.timeout) {
            obj.timeout = 200;
        }
        let percent = (new Date().valueOf() - obj.startTime) / obj.duration;
        if (percent > 1) {
            if (obj.callback) {
                obj.callback();
            }
            return;
        } else {
            if (obj.onStep) {
                obj.onStep(percent);
            }
        }
        setTimeout(() => this.waitFor.call(this, obj), obj.timeout);
    }
}
finished(new CustomTime());

