//tslint:disable-next-line variable-name
var CustomTime = class CustomTimeC {
    constructor() {
        this.n = () => new Date().valueOf();
        this.abort = false;
    }
    /**
      * @param {{
         * startTime?: Number,
         * duration: Number,
         * callback:Function,
         * timeout?:number,
         * onStep?:(percent:number)=>void}} obj
         */
    async waitForAsync(obj) {
        return new Promise((res, err) => {
            const origCallback = obj.callback;
            obj.callback = (args) => {
                if(origCallback) {
                    origCallback(args);
                }
                res(args);
            };
            this.waitFor(obj);
        });

    }

    /**
     * @param {{
     * startTime?: Number,
    * duration: Number,
    * callback:Function,
    * timeout?:number,
    * onStep?:(percent:number)=>void}} obj
    */
    waitFor(obj) {
        if(!obj.startTime) {
            obj.startTime = new Date().valueOf();
        }
        if(!obj.timeout) {
            obj.timeout = 200;
        }
        if(this.abort === true) {
            return;
        }
        let percent = (new Date().valueOf() - obj.startTime) / obj.duration;
        if(percent > 1) {
            if(obj.callback) {
                obj.callback();
            }
            return;
        } else {
            if(obj.onStep) {
                obj.onStep(percent);
            }
        }
        setTimeout(() => this.waitFor.call(this, obj), obj.timeout);
    }

    /**
     * @template T
     * @param {()=>Promise<T>} callble
     * @returns {Promise<T>}
     */
    async evaluateDuration(callble, fortime = console.log) {
        const start = Date.now();
        const value = await callble();
        fortime(Date.now() - start);
        return value;
    }

    /**
     * breaks on callback()==false
     * skips timeout on callback()==null;
     * @template T
     * @template { keyof HTMLElementTagNameMap} V
     * @param {import('./time').AsnyForEachOptions<T,V>} options
     */
    async asyncForEach(options) {
        const delay = options.delay || 500;
        try {
            for(let item of options.array) {
                try {
                    let subItem;
                    if(options.subItemType && item instanceof HTMLElement) {
                        subItem = sc.g.eval(options.subItemType, { ...options.subitemOptions, first: true, parent: item });
                    }
                    const nextDelay = await options.callback(item, subItem);
                    if(nextDelay === true) {
                        await this.waitForAsync({
                            duration: delay,
                            callback: () => {
                                //
                            }
                        });
                    }
                    if(nextDelay === false) {
                        break;
                    }
                } catch(e) {
                    logKibana('ERROR', {
                        message: 'error in async forEach',
                        ...options,
                        ...{
                            currentItem: item
                        }
                    }, e);
                }
            }
        } catch(e) {
            logKibana('ERROR', {
                message: 'error in async forEach',
                ...options
            }, e);
        }
    }

};
/**
 * @typedef {CustomTime} CustomTimeClass
 */
new EvalScript('').finish(new CustomTime());