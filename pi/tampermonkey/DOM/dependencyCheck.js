
/// <reference path="../customTypes/index.d.ts" />

/**
 * @type {EvalScript<{intervalId:NodeJS.Timeout}> }
 */
var dep = new EvalScript('', {
    run: async (resolver, set) => {

        const http = await reqS('http');
        var scriptContents = {};

        let key = GM_getValue('security_key');
        if(!key) {
            key = prompt('enter key');
            GM_setValue('security_key', key);
        }

        // @ts-ignore
        var url = `${document.window.backendUrl || 'http://localhost:4280'}?url=${location.href.replace(location.search, '')}&auth=${key}`;

        /**@param {CustomScript} script */
        function shouldCheck(script) {
            script.src = script.src || script.source;

            return script.src.includes('localhost') || script.src.includes('pi4.e6azumuvyiabvs9s.myfritz.net');
        }
        /**@param {string} urlString */
        function scriptify(urlString) {
            return { src: urlString, remove: () => { return; } };
        }

        /**
         * @returns {Array<CustomScript>}
         *
         */
        function getSCriptsArray() {
            const evalScripts = Object.entries(document.props.evalScripts);
            if(evalScripts.length > 0) {
                return [...evalScripts.map(obj => {
                    return obj[1];
                }), scriptify(url)];
            }
            /**@type {Array<CustomScript>} */
            let sources = [scriptify(url), ...document.body.getElementsByTagName('script')].filter(scr => {
                let src = (scr.src || scr['source']);
                if(!src) {
                    return;
                }
                return shouldCheck(scr);
            });
            if(location.origin.includes('pi4.e6azumuvyiabvs9s')) {
                const styles = [...document.querySelectorAll('link')].map(link => scriptify(link.href));
                sources = [...sources, scriptify(location.origin + location.pathname), ...styles];
            }
            return sources;
        }

        (async function initAutoRefresh() {

            /** @type {Array<CustomScript>} */
            let scripts = getSCriptsArray();
            let scriptSrc = scripts.map(script => script.src);
            try {
                scriptContents[url] = await http.gm_fetch(url);
            } catch(e) {
                console.log('failed fetching ' + url);
            }
            /* for(let script of scripts) {
                 await new Promise(r => setTimeout(r, 500));
                 if(script.src.includes('localhost')) {
                     try {
                         scriptContents[script.src] = await http.gm_fetch(script.src);
                     } catch(e) {
                         console.log('failed fetching ' + script.src);
                     }
                 }
             }*/
            console.log('INIT REFRESH !!');
            scriptCheck();
        })();

        async function scriptCheck() {
            try {
                let scripts = getSCriptsArray();

                for(let script of scripts) {
                    await checkScript(script);
                }
            } catch(error) {
                console.error(error);
            }
            set.intervalId = setTimeout(scriptCheck, 1000);
        }

        /**@param {CustomScript} script */
        async function checkScript(script) {

            if(shouldCheck(script)) {
                try {
                    let time = Date.now();
                    const requestUrl = `${script.src}${script.src.includes('?') ? '&' : '?'}fileOnly=true`;
                    let newScript = await http.gm_fetch(requestUrl, false)
                        .catch(e => {
                            console.log(`error with script ${script.src} \n${script.stack}`);
                        });
                    let duration = Date.now() - time;
                    if(duration > 1500) {
                        console.warn(`${script.src} took ${duration} to fetch`);
                    }
                    if(!scriptContents[script.src]) {
                        scriptContents[script.src] = newScript;
                    }
                    if(typeof newScript === 'string' && scriptContents[script.src] !== newScript) {
                        await resetScript(script);
                    }
                } catch(e) {
                    console.log('failed fetching ' + url, e);
                }

            }
        }

        async function resetScript(script) {
            if(script.isModular || script.reset) {
                let refresh = true;
                if(script.reset) {
                    try {
                        if(script.reset() === false) {
                            refresh = false;
                        }
                    } catch(e) {
                        handleError(e);
                    }
                }
                let afterRefresh = script.afterReset;
                if(refresh) {
                    console.log(`REFRESHING ${script.src}`);
                    let scriptUrl = script.src;
                    script.remove();
                    scriptContents[script.src] = undefined;
                    delete document.props.evalScripts[script.src];
                    await req(scriptUrl, { cache: false });
                    if(afterRefresh) {
                        try {
                            afterRefresh();
                        } catch(e) {
                            handleError(e);
                        }
                    }
                }
            } else {
                if(shouldCheck(scriptify(location.origin + location.pathname))) {
                    location.reload();
                }
            }

        }
    },
    reset: (obj) => {
        clearInterval(obj.intervalId);
    }
});