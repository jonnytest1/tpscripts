/// <reference path="../customTypes/index.d.ts" />
/// <reference path="./storage.d.ts" />

/**
 * @type {{type:EvalScript<{}>}}
 */
var storageimpl = new EvalScript('', {
    async: true,
    run: async (resolv, set) => {

        window.StorageImplementation = class StorageImplementationClass {

            /**
             *
             * @param {import('./storage').StorageBase} base
             */
            constructor(base) {
                this.base = base;
                for(let i in base) {
                    if(i !== 'get' && i !== 'set') {
                        let val = base[i];
                        if(typeof val === 'function') {
                            val.bind(this);
                        }
                        this[i] = val;
                    }
                }
            }
            g(identifier, standard) {
                return this.base.get(identifier, standard);
            }

            s(identifier, element) {
                this.base.set(identifier, element);
            }

            p(identifier, value, options = {}) {
                options.default = options.default || [];
                if(options.mapKey) {
                    options.default = {};
                }
                let storageObj = this.base.get(identifier, options.default);
                let ar = storageObj;
                if(options.mapKey) {
                    if(ar[options.mapKey] === undefined) {
                        ar[options.mapKey] = [];
                    }
                    ar = ar[options.mapKey];

                }
                ar.push(value);
                this.base.set(identifier, storageObj);
            }

            /**
            * @param { String } identifier ""
            * @param { String } key ""
            * @param { any } value ""
            * @param { any } standard ""
            * @returns {any}
            */
            setValue(identifier, key, value, standard = {}) {
                let obj = this.base.get(identifier, standard);
                obj[key] = value;
                this.base.set(identifier, obj);
            }

            removeWhere(identifier, filterFunction) {
                let elements = this.base.get(identifier, []);
                elements = elements.filter(el => !filterFunction(el));
                this.base.set(identifier, elements);
                return elements;
            }
            /**
             *
             * @param {string} identifier
             * @param {*} filterFunction
             * @param {{mapKey?:string}} [options]
             */
            filter(identifier, filterFunction, options = {}) {
                let elements = this.base.get(identifier, []);
                let array = elements;
                if(options.mapKey) {
                    if(!elements[options.mapKey]) {
                        elements[options.mapKey] = [];
                    }
                    array = elements[options.mapKey].filter(filterFunction);
                    elements[options.mapKey] = array;
                } else {
                    array = elements.filter(filterFunction);
                    elements = array;
                }

                this.base.set(identifier, elements);
                return array;
            }

            /**
             * @type {import("./storage").filterFunction}
             */
            static filterDaysFunction(days, options = {}) {
                return (el, index, array) => {
                    if(options.keepLatest) {
                        debugger;
                        const sorted = array.sort((a, b) => a.timestamp - b.timestamp);
                        return sorted[0].timestamp === el.timestamp || el.timestamp > Date.now() - (1000 * 60 * 60 * 24 * days);
                    }
                    return el.timestamp > Date.now() - (1000 * 60 * 60 * 24 * days);
                };
            }

        };
        resolv(null);

    },
    reset: (set) => {
        //
    }
});