/* global sc, handleError */
// eslint-disable-next-line no-unused-vars

var S = {
    s: (identifier, element) => {
        sessionStorage.setItem('tampermonkey_' + identifier, JSON.stringify(element));
    },
    g: (identifier, standard = new Array(0)) => {
        let element = JSON.parse(sessionStorage.getItem('tampermonkey_' + identifier));
        if (element === null) {
            S.s(identifier, standard);
            return standard;
        }
        return element;
    },
    p: (identifier, object, standard = []) => {
        try {
            let ar = S.g(identifier, standard);
            if (ar.constructor.name === 'Array') {
                ar.push(object);
                S.s(identifier, ar);
            }
        }
        catch (e) {
            handleError(e);
        }
    },
    /**
    * @param { String } identifier ""
    * @param { String } key ""
    * @param { any } value ""
    * @param { any } standard ""
    * @returns {any}
    */
    setValue: (identifier, key, value, standard = {}) => {
        let obj = S.g(identifier, standard);
        obj[key] = value;
        S.s(identifier, obj);
    }
};
sc.S = S;
finished(S);