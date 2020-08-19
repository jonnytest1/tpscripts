/* global sc, handleError */
///<reference path="storage.d.ts"/>
/**
 * @typedef {import('storage').CustomStorage & {
 * filter:(identifier:string,filterFunction:(value:any)=>boolean)=>Array<any>
 * }} LocalStorage
 *
 * @type {LocalStorage}
 */
var L = {
    /**
     * @param {Array} standard
     */
    p: (identifier, object, standard = []) => {
        let ar = L.g(identifier, standard);
        if(ar instanceof Array) {
            ar.push(object);
            L.s(identifier, ar);
        }
        else {
            handleError(new Error('not an array'));
        }
    },
    s: (identifier, value) => {
        localStorage.setItem('tampermonkey_' + identifier, JSON.stringify(value));
        return value;
    },
    filter: (identifier, filterFunction) => {
        /**@type {Array<any>} */
        let elements = L.g(identifier, []);
        elements = elements.filter(filterFunction);
        L.s(identifier, elements);
        return elements;
    },
    g: (identifier, standard = []) => {
        let element = JSON.parse(localStorage.getItem('tampermonkey_' + identifier));
        if(element === null) {
            element = JSON.parse(localStorage.getItem(identifier));
            if(element !== null) {
                L.s(identifier, element);
                localStorage.removeItem(identifier);
                try {
                    localStorage.removeItem('checking');
                } catch(e) {
                    //
                }
            }
        }
        if(element === null) {
            L.s(identifier, standard);
            return standard;
        }
        return element;
    }
};
sc.L = L;
finished(L);