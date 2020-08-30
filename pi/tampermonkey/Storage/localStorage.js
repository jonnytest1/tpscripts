/* global sc, handleError */
///<reference path="storage.d.ts"/>
/**
 * @typedef {import('storage').CustomStorage & {
 * filter:<T>(identifier:string,filterFunction:(value:T)=>boolean)=>Array<T>
 * }} LocalStorage
 *
 * @type {LocalStorage}
 */
var L = new StorageImplementation({
    set: (identifier, value) => {
        localStorage.setItem('tampermonkey_' + identifier, JSON.stringify(value));
        return value;
    },
    get: (identifier, standard) => {
        if(!standard) {
            standard = [];
        }
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
});
sc.L = L;
finished(L);