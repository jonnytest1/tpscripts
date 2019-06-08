/* global sc, handleError */

var L = {
    p: (identifier, object, standard = []) => {
        let ar = L.g(identifier, standard);
        if (ar.constructor.name === "Array") {
            ar.push(object);
            L.s(identifier, ar);
        }
        else {
            handleError("not an array");
        }
    },
    s: (identifier, value) => {
        localStorage.setItem("tampermonkey_" + identifier, JSON.stringify(value));
    },
    g: (identifier, standard = []) => {
        let element = JSON.parse(localStorage.getItem("tampermonkey_" + identifier));
        if (element === null) {
            element = JSON.parse(localStorage.getItem(identifier));
            if (element !== null) {
                L.s(identifier, element);
                localStorage.removeItem(identifier);
                try {
                    localStorage.removeItem("checking");
                } catch (e) {
                    //
                }
            }
        }
        if (element === null) {
            L.s(identifier, standard);
            return standard;
        }
        return element;
    }
};
sc.L = L;
finished(L);