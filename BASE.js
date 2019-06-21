/// <reference path="./eval-script.js" />

console.log('entrypoint');
/**@type {Document&{window?}} */
const d = document;
for (let att in d.window) {
    if (att.startsWith('GM_')) {
        // @ts-ignore
        window[att] = document.window[att];
    }
}
/**
 * @type {HTMLElement &{
 *   canInject?:boolean
 *   canInjectText?:boolean
 * }}
 */
let baseContainer = document.createElement('tampermonkey_base_container');
baseContainer.canInjectText = true;
document.body.insertBefore(baseContainer, document.body.children[0]);
document.evalScripts = {};
/** @type {scI} */
var sc = {
    D: {
        //created element id counter
        n: 0
    },
    menuContainer: baseContainer
};

window.sc = sc;

/**
 * @typedef {{
 *  resolve?:Function,
 *  source?:String,
 *  loaded?:boolean,
 *  args?:any,
 *  src?:string,
 *  isAsync?:boolean,
 *  isModular?:boolean,
 *  reset?:()=>void|boolean,
 *  errorCallback?:Function
 * }} CustomScript
 *
 * @typedef {CustomScript&{
 *  resolvers?:Array<Function>,
 *  dispatchEvent:Function,
 *  addEventListener:Function,
 *  remove:Function
 * }} CustomEvalScript
 *
 *
 *  @typedef {HTMLOrSVGScriptElement & CustomScript } CustomHTMLscript
*/

/**
 * inject script with path as url
 * @param {string} path
 * @returns {Promise<any>}
 */
async function req(path, urlTest = false) {
    return new Promise(async (resolve) => {
        let onScriptLoad = ((resolver) => {
            return (e) => {
                if (!e.target.isAsync || e.isAsync) {
                    if (!e.target.loaded) {
                        e.target.loaded = true;
                        e.target.args = e.args;
                        //console.log("resolving for " + (e.target.source || e.target.src) + (e.isAsync ? " async" : ""));
                        resolver(e.args);
                    } else {
                        console.log('target already loaded ' + (e.target.source || e.target.src));
                        resolver(e.target.args);
                    }
                } else {
                    //console.log("got standard finish for async target NOT RESOLVING " + (e.target.source || e.target.src));
                }
            };
        });

        /**@type {Array<CustomHTMLscript>} */
        // @ts-ignore
        let rootElements = document.querySelectorAll('script');

        for (let injectedScript of [...rootElements]) {
            if (injectedScript.source === path || injectedScript.src === path) {
                if (injectedScript.loaded) {
                    console.log('resolving loaded for ' + (injectedScript.source || injectedScript.src));
                    resolve(injectedScript.args);
                } else {
                    injectedScript.addEventListener('load', onScriptLoad(resolve));
                }
                return;
            }
        }
        for (let scr of Object.entries(document.evalScripts)
            .map(o => o[1])) {
            /**@type {CustomEvalScript} */
            let cScript = scr;
            if (cScript.src === path) {
                if (cScript.loaded) {
                    console.log('resolving loaded for ' + (cScript.source || cScript.src));
                    resolve(cScript.args);
                } else {
                    cScript.addEventListener('load', onScriptLoad(resolve));
                }
                return;
            }
        }

        // console.log("injecting " + path);

        if (urlTest || baseContainer.canInject === true) {
            injectScriptNyUrl(path);
        } else if (baseContainer.canInjectText) {
            // @ts-ignore
            injectSCriptByText({ src: path, resolve: resolve });
        } else {
            // @ts-ignore
            injectByEval({ src: path, resolve: resolve });
        }
        /**
         * @param {CustomHTMLscript} scr
         */
        function injectByEval(scr) {
            scr.src = scr.src || scr.source;
            function evalText(text, url) {
                /**@type {CustomEvalScript } */
                const customEvalScript = {
                    src: url,
                    resolvers: [onScriptLoad(scr.resolve)],
                    /**@param {CustomEvalScript } scrO*/
                    dispatchEvent: (e, scrO) => {
                        if (!scrO.loaded) {
                            scrO.loaded = true;
                            scrO.args = e.args;
                        }
                        scrO.resolvers.forEach(res => {
                            res({ ...e, target: {} });
                        });
                    },
                    remove: () => { return; },
                    addEventListener: (e) => {
                        //tslint:disable-next-line
                        this.resolvers.push(e);
                    }
                };
                document.evalScripts[url] = customEvalScript;
                const evalScr = eval.call(window, text.replace('new EvalScript(\'\'', `new EvalScript('${url}'`));
                if (!evalScr || (evalScr.name && evalScr.name === 'EvalScript')) {
                    document.evalScripts[url].loaded = true;
                    scr.resolve();
                    return;
                }
                if (!evalScr.constructor || !(evalScr.constructor.name === 'EvalScript')) {
                    document.evalScripts[url].args = evalScr;
                    scr.resolve(evalScr);
                }
            }
            if (scr.textContent) {
                evalText(scr.textContent, scr.src);
                return;
            }
            GM_xmlhttpRequest({
                url: scr.src,
                method: 'GET',
                onload: (e) => evalText(e.responseText, scr.src),
                onerror: handleError,
                onabort: handleError
            });
        }

        function injectScriptNyUrl(scriptPath) {
            /**
             * @type {HTMLScriptElement & CustomScript}
             */
            let injectingScript = document.createElement('script');
            injectingScript.src = scriptPath;
            injectingScript.onload = onScriptLoad(resolve);
            injectingScript.resolve = resolve;
            window.onerror = (/**@type Event */e) => {
                if (urlTest && e.target === injectingScript) {
                    resolve(false);
                }
            };
            /**
            * @param {any} e
            */
            injectingScript.onerror = (e) => {
                if (urlTest && e === 'done') {
                    resolve(true);
                    return;
                }
                if (e.eventPhase === 2) {
                    if (!urlTest) {
                        injectSCriptByText(e.target);
                    }
                } else {
                    handleError(e);
                }
            };
            try {
                document.body.appendChild(injectingScript);
            } catch (e) {
                debugger;
                if (!urlTest) {
                    injectSCriptByText(injectingScript);
                }
            }

        }

        /**
         * @param {CustomHTMLscript} failedScriptElement
         */
        function injectSCriptByText(failedScriptElement) {

            /**
             * @type {CustomHTMLscript}
             */
            let errorFixScript = document.createElement('script');
            errorFixScript.onload = onScriptLoad(failedScriptElement.resolve);
            console.log('blocked ? injecting extension ' + path);
            errorFixScript.source = failedScriptElement.src;
            window.onerror = (/**@type {Event} */e) => {
                /**@type {EventTarget & {errorCallback?:Function}} */
                const target = e.target;
                debugger;

                if (target.errorCallback) {
                    baseContainer.canInjectText = false;
                    target.errorCallback(e.target);
                }
            };
            /**
             * @type {EventTarget & CustomScript}
             */
            errorFixScript.resolve = resolve;
            GM_xmlhttpRequest({
                url: path,
                method: 'GET',
                onload: (e) => {
                    errorFixScript.textContent = e.responseText;

                    errorFixScript.onerror = /**@param {any} errorEvent */errorEvent => {
                        baseContainer.canInjectText = false;
                        injectByEval(errorEvent.target);
                    };
                    document.body.appendChild(errorFixScript);
                    errorFixScript.onload = onScriptLoad(errorFixScript.resolve);
                    console.log('calling standard finish for ' + errorFixScript.source);
                    finished(undefined, false, errorFixScript);
                },
                onerror: (e) => {
                    debugger;
                    handleError(e);
                },
                onabort: (e) => {
                    debugger;
                    handleError(e);
                }
            });
        }
    });
}
window.req = req;
//random change
/**
 * inject script with path as url from local backend
 * @param {String } path
 * @global
 */
async function reqS(path, urlTest = false) {

    path = 'http://localhost:4280/' + path;
    if (!path.endsWith('/')) {
        path = path + '.js';
    }
    console.log('loading ' + path);
    return req(path, urlTest);
}
window.reqS = reqS;
Object.assign(window, { reqS });
/**
 * @param {*} content
 * @param {*} async
 * @param {*} currentScript
 */
function finished(content, async = false, currentScript = document.currentScript) {
    //console.log("finishing for " + (currentScript.source || currentScript.src));

    /**
     * @type {Event & {args?:any,isAsync?:boolean}}
     */
    let event = new Event('load');
    event.args = content;
    event.isAsync = async;
    currentScript.dispatchEvent(event, currentScript);
}
window.finished = finished;

async function checkScript() {
    return new Promise((res) => {
        reqS('injectTest', true)
            .then((ret) => {
                res(!!ret);
            });
        setTimeout(() => res(false), 1000);
    });
}
new Promise(async (resolver) => {

    baseContainer.canInject = await checkScript();
    console.log('canInject returned ' + baseContainer.canInject);

    await reqS('eval-script');

    let logging = await reqS('logging');
    // @ts-ignore
    let notification = await reqS('notification');

    await reqS('DOM/dependencyCheck');
    console.log('loaded dependencyCheck');

    /**@type {ElementGetter} */
    let find = await reqS('find');
    // eslint-disable-next-line no-unused-vars
    let overwrites = IMPORT;

    await reqS('DOM/CircularMenu');

    //tslint:disable-next-line variable-name
    let Storage_greaseStorage = IMPORT;

    await CircularMenu.main();

    window.backendUrl = 'http://localhost:4280';
    resolver({});

    //index.php adds here
    //tslint:disable-next-line
})
