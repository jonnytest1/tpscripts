
class EvalScript {
    /**
     *
     * @typedef EvalScriptOptions
     *
     * @property {(obj:any)=>boolean|void} [reset]
     * @property {(resolver:Function,set:any)=>Promise<boolean|void>} [run] if true waits for manual call to finish
     *
     * @param {EvalScriptOptions} options
     * @param {string} [url]
     */
    constructor(url, options = {}) {
        this.url = url;
        /**@type {CustomHTMLscript}*/
        this.script = document.currentScript || document.evalScripts[this.url];
        if (this.script) {
            this.script.reset = () => this.reset.call(this);
        }
        this.callback = options.run;
        this.resetFunction = options.reset;
        this.options = {};
        this.onload = null;

        this.run();
    }

    set() {
        return this.options;
    }

    reset() {
        if (!this.resetFunction) {
            return;
        }
        return this.resetFunction(this.options);
    }
    async run() {
        const result = await new Promise(async resolver => {
            if (this.callback) {
                if (!await this.callback.call(window, resolver, this.options)) {
                    this.finish(undefined);
                    resolver({ notAsync: true });
                }
            } else {
                resolver();
            }
        }).catch(e => { debugger; });
        if (!result || !result.notAsync) {
            this.finish(result, true);

        }
    }

    finish(arg, async = false) {
        if (arg) {
            arg.context = this;
        } else {
            arg = { context: this };
        }
        finished(arg, async, this.script);
    }

    dispatchEvent(loadEvent) {
        this.onload({ ...loadEvent, target: this });
    }
}
window.EvalScript = EvalScript;