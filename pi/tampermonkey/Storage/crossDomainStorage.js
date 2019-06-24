
/// <reference path="../customTypes/index.d.ts"/>
/**
 * @typedef resolv
 * @property {(str:string)=>any} g
  */

/**
 * @type {HTMLOrSVGScriptElement & CustomScript }
 */
let cdScript = document.currentScript;
cdScript.isAsync = true;

let greaseCrossDomainStorage = 'crossdomainstorage';
reqS('Storage/SessionStorage')
    .then(ss => {
        function getObject() {
            if ((sc.g.W().name === '' || sc.g.W().name
                .indexOf('{') === -1)) {
                if (sc.g.W()['name2'] === '' || sc.g.W()['name2'] === undefined || sc.g.W()['name2']
                    .indexOf('{') === -1) {
                    sc.g.W().name = JSON.stringify(sc.S.g(greaseCrossDomainStorage, {}));
                }
            }
            let storageObject;
            try {
                storageObject = JSON.parse(sc.g.W().name);
            }
            catch (e) {
                storageObject = JSON.parse(sc.g.W()['name2']);
            }
            // return sc.S.g("name");
            return storageObject;
        }

        var CD = {

            s: (identifier, element) => {
                if ((location.href.indexOf('facebook') > -1 && location.href.indexOf('oauth?app_id') > -1)) {
                    return;
                }
                let storageObject = getObject();
                storageObject[identifier] = element;
                sc.g.W().name = JSON.stringify(storageObject);
                sc.S.s(greaseCrossDomainStorage, storageObject);
                return sc.g.W().name;
            },
            g: (identifier, standard = new Array(0)) => {
                if ((location.href.indexOf('facebook') > -1 && location.href.indexOf('oauth?app_id') > -1)) {
                    return standard;
                }
                let obj = getObject();
                /*let GO = G.g("tempSS", []);
                for (let i = GO.length - 1; i > -1; i--) {
                    if (GO[i].url === location.href) {
                        obj[GO[i].identifier] = GO[i].content;
                        CD.s(GO[i].identifier, GO[i].content);
                        GO.splice(i, 1);
                    }
                }
                G.s("tempSS", GO);*/
                let element = obj[identifier];
                if (element === undefined || element === null) {
                    CD.s(identifier, standard);
                    return standard;
                }
                return element;
            },
            p: (identifier, object, standard) => {
                if (!standard) {
                    standard = [];
                }
                try {
                    let ar = CD.g(identifier, standard);
                    ar.push(object);
                    CD.s(identifier, ar);
                    return sc.g.W().name;
                }
                catch (err) {
                    handleError(err);
                }
            }
        };
        sc.CD = CD;
        finished(CD, true, cdScript);
    });
