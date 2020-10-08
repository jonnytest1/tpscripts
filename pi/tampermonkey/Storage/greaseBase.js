/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<unknown>}}
 */
var greaseBase = new EvalScript('', {
    async: false,
    run: async (resolv, set) => {
        /**
         * @type {import('./storage').StorageBase&{l,toClipboard}}
         */
        const grease = {
            set: (identifier, element) => {
                if(window['GM_setValue']) {
                    window['GM_setValue'](identifier, element);
                } else {
                    localStorage[identifier] = JSON.stringify(element);
                }
                return element;
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
            },
            l: (name, fn, value1) => {
                function callfn(attribute, oldV, newV, remote) {
                    if(value1) {
                        fn(value1, attribute, oldV, newV, remote);
                    }
                    else {
                        fn(attribute, oldV, newV, remote);
                    }
                    //fn : function(name, old_value, new_value, remote) {}
                }
                return window['GM_addValueChangeListener'](name, callfn);
            },
            //run:(filename, fnc)=> {
            //	this.s(this.sc.c.sI.GS.scriptcomm2, { mode: "getcode", file: filename, timestamp: new Date().valueOf(), url: location.href, fnc: fnc });
            //}
            toClipboard: (text, info = '') => {
                return window['GM_setClipboard'](text, info);
            },
        };
        resolv(grease);
        return false;

    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
greaseBase;