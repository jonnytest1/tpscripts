/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<unknown>}}
 */
var greaseBase = new EvalScript('', {
    async: true,
    run: async (resolv, set) => {
        /**
         * @type {import('./storage').StorageBase}
         */
        const grease = {
            set: (identifier, element) => {
                window['GM_getValue'] ? window['GM_setValue'](identifier, element) : localStorage[identifier] = JSON.stringify(element);
            },
            /**
            * @param { String } identifier ""
            * @param { any } standard ""
            * @returns {any}
            */
            get: (identifier, standard = new Array(0)) => {
                let element;
                if(window['GM_getValue']) {
                    element = window['GM_getValue'](identifier);
                } else {
                    element = localStorage[identifier];
                    if(!element) {
                        grease.set(identifier, standard);
                        return standard;
                    } else {
                        return JSON.parse(element);
                    }
                }
                if(element === null || element === undefined) {
                    grease.set(identifier, standard);
                    return standard;
                }
                return element;
            }
        };
        resolv(grease);

    },
    reset: (set) => {
        //
    }
});