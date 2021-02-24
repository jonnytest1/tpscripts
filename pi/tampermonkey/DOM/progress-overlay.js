/// <reference path="../customTypes/index.d.ts" />

/**
 * @typedef ProgressOverlayOptions
 * @property {number} [max]
 * @property {number} [count]
 * @property {number} [start]
 * @property {string} [text]
 * @property {HTMLElement} [popup]
 * @property {()=>void} [remove]
 * @property {any} [timeout]
 *
 *
 * @typedef ExpandedProgressOverlayOptions
 * @property {number} [max]
 * @property {number} [count]
 * @property {number} [start]
 * @property {string} [text]
 * @property {HTMLElement} [popup]
 * @property {()=>void} remove
 * @property {any} [timeout]
 * /

/**
 */

/**
 * @type {{type:EvalScript<{}>}}
 */
var progressOverlay = new EvalScript('', {
    waitForResolver: true,
    run: async (resolv, set) => {
        const button = await reqS('DOM/button');

        /**
         * @param {ProgressOverlayOptions} [options]
         * @param {(options:ProgressOverlayOptions)=>Promise<number>|number} callback
         */
        function progress(callback, options = {}) {
            options.count = 0;
            if(!options.max) {
                options.max = 1;
            }
            options.remove = () => {
                if(options.timeout) {
                    clearTimeout(options.timeout);
                    options.popup.remove();
                }
            };
            progressI(callback, options);
            return options;
        }
        /**
         *
         * @param {*} callback
         * @param {ProgressOverlayOptions} options
         */
        async function progressI(callback, options = {}) {

            let percent = await callback(options);
            if(options.popup) {
                options.popup.remove();
            }

            options.count += percent;

            let current = options.count;
            let goal = options.max;
            if(options.start) {
                goal = options.max - options.start;
                current = options.count - options.start;
            }
            percent = current / goal;

            percent = Math.round(percent * 100) / 100;

            if(percent >= 1) {

                let text = `finished`;
                if(options.text) {
                    text = `${text}\n${options.text}`;
                }
                options.popup = crIN({
                    text,
                    styles: {
                        position: 'fixed',
                        bottom: 12,
                        right: 12,
                        width: 200,
                        height: 60,
                        borderRadius: 10,
                        backgroundColor: 'green'
                    }
                });
                setTimeout(() => {
                    if(options.popup) {
                        options.popup.remove();
                    }
                }, 1000);
                return;
            } else {
                const percentStr = `${percent * 100}`.substr(0, 4);

                let text = `${new Number(percentStr)}% finished`;
                if(options.text) {
                    text = `${text}\n${options.text}`;
                }
                options.popup = crIN({
                    text,
                    styles: {
                        position: 'fixed',
                        bottom: 12,
                        right: 12,
                        width: 200,
                        height: 60,
                        borderRadius: 10,
                        backgroundColor: '#11c2e8'
                    }
                });
            }
            options.timeout = setTimeout(progressI, 0, callback, options);
        }
        resolv(progress);
    },
    reset: (set) => {
        return true;
    },
    afterReset: () => true
});