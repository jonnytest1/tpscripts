
console.log("entrypoint");

for (let att in document.window) {
    if (att.startsWith("GM_")) {
        // @ts-ignore
        window[att] = document.window[att];
    }
}

let baseContainer = document.createElement("tampermonkey_base_container");
document.body.insertBefore(baseContainer, document.body.children[0]);

/** @type {sc} */
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
 *  reset?:()=>void
 * }} CustomScript
 * 
 * 
 *  @typedef {HTMLOrSVGScriptElement & CustomScript } CustomHTMLscript
*/

/**
 * inject script with path as url
 * @param {string} path
 * @returns {Promise<any>}
 */
function req(path, urlTest = false) {
    return new Promise(async (resolve) => {
        let onScriptLoad = ((resolver) => {
            return function (e) {
                if (!e.target.isAsync || e.isAsync) {
                    if (!e.target.loaded) {
                        e.target.loaded = true;
                        e.target.args = e.args;
                        //console.log("resolving for " + (e.target.source || e.target.src) + (e.isAsync ? " async" : ""));
                        resolver(e.args);
                    } else {
                        console.log("target already loaded " + (e.target.source || e.target.src));
                        resolver(e.target.args);
                    }
                } else {
                    //console.log("got standard finish for async target NOT RESOLVING " + (e.target.source || e.target.src));
                }
            }
        })


        let rootElements = document.body.children;

        for (let i = 0; i < rootElements.length; i++) {
            /**
             * @type {Element&CustomScript}
             */
            let injectedScript = rootElements[i];
            if (injectedScript.source == path || injectedScript.src == path) {
                if (injectedScript.loaded) {
                    console.log("resolving loaded for " + (injectedScript.source || injectedScript.src));
                    resolve(injectedScript.args);
                } else {
                    injectedScript.addEventListener("load", onScriptLoad(resolve));
                }
                return;
            }
        }
        // console.log("injecting " + path);

        if (urlTest || baseContainer.canInject == true) {
            injectScriptNyUrl(path);
        } else {
            injectSCriptByText({ src: path, resolve: resolve });
        }
        function injectScriptNyUrl(path) {
            /**
             * @type {HTMLScriptElement & CustomScript}
             */
            let injectingScript = document.createElement("script");
            injectingScript.src = path;
            injectingScript.onload = onScriptLoad(resolve);
            injectingScript.resolve = resolve;
            injectingScript.reqS = reqS;
            injectingScript.finished = finished;
            /**
            * @param {Event} e
            */
            injectingScript.onerror = (e) => {
                if (urlTest && e == "done") {
                    resolve(true);
                    return;
                }
                if (e.eventPhase == 2) {
                    injectSCriptByText(e.target)
                } else {
                    handleError(e);
                }
            }
            try {
                document.body.appendChild(injectingScript);
            } catch (e) {
                debugger;
                if (!urlTest) {
                    injectSCriptByText(injectingScript)
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
            let errorFixScript = document.createElement("script");
            errorFixScript.onload = onScriptLoad(failedScriptElement.resolve);
            console.log("blocked ? injecting extension " + path);
            errorFixScript.source = failedScriptElement.src;

            /**
             * @type {EventTarget & CustomScript}
             */
            errorFixScript.resolve = resolve;
            GM_xmlhttpRequest({
                url: path,
                method: 'GET',
                onload: (e) => {
                    errorFixScript.textContent = e.responseText;
                    document.body.appendChild(errorFixScript);
                    errorFixScript.onload = onScriptLoad(errorFixScript.resolve);
                    console.log("calling standard finish for " + errorFixScript.source);
                    finished(undefined, false, errorFixScript);
                },
                onerror: (e) => handleError(e),
                onabort: (e) => handleError(e)
            });
        }
    })
}
window.req = req;
//random change
/**
 * inject script with path as url from local backend
 * @param {String } path 
 * @global
 */
function reqS(path, urlTest = false) {
    return req("http://localhost:4280/" + path + ".js", urlTest);
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
    let event = new Event("load");
    event.args = content;
    event.isAsync = async;
    currentScript.dispatchEvent(event);
}
window.finished = finished;

function checkScript() {
    return new Promise((res) => {
        reqS("injectTest", true).then((ret) => {
            res(!!ret);
        })
        setTimeout(() => res(false), 1000)
    })
}
new Promise(async (resolver) => {
    baseContainer.canInject = await checkScript();

    // eslint-disable-next-line no-unused-vars
    let logging = await reqS("logging");
    // @ts-ignore 
    let notification = await reqS("notification");

    //await reqS("DOM/dependencyCheck");
    // eslint-disable-next-line no-unused-vars

    /**@type {ElementGetter} */
    let find = await reqS("find");
    // eslint-disable-next-line no-unused-vars
    let overwrites = IMPORT;

    await reqS("DOM/CircularMenu");

    let Storage_greaseStorage = IMPORT;
    await CircularMenu.main();

    window.backendUrl = 'http://localhost:4280';

    resolver({})
})


