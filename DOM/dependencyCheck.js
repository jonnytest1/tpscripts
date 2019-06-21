
/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../http.js" />
/// <reference path="../eval-script.js" />

new EvalScript('', {
    run: async (resolver, set) => {

        var scriptContents = {};
        var url = 'http://localhost:4280?url=' + location.href;

        /**
         * @returns {Array<HTMLScriptElement>}
         *
         */
        function getSCriptsArray() {
            const evalScripts = Object.entries(document.evalScripts);
            if (evalScripts.length > 0) {
                return evalScripts.map(obj => {
                    return obj[1];
                });
            }
            return [...document.body.getElementsByTagName('script')];
        }

        (async function initAutoRefresh() {
            await reqS('http');

            /** @type {Array<HTMLScriptElement>} */
            let scripts = getSCriptsArray();
            try {
                scriptContents[url] = await gm_fetch(url);
            } catch (e) {
                console.log('failed fetching ' + url);
            }
            for (let script of scripts) {
                if (script.src.includes('localhost')) {
                    try {
                        scriptContents[script.src] = await gm_fetch(script.src);
                    } catch (e) {
                        console.log('failed fetching ' + script.src);
                    }
                }
            }
            console.log('INIT REFRESH !!');
            scriptCheck();
        })();

        async function scriptCheck() {
            let scripts = getSCriptsArray();
            for (let script of scripts) {
                await checkScript(script);
            }

            // @ts-ignore
            checkScript({ src: url });

            set.intervalId = setTimeout(scriptCheck, 500);
        }

        /**@param {HTMLScriptElement & CustomScript} script */
        async function checkScript(script) {

            if (script.src.includes('localhost')) {
                try {
                    let newScript = await gm_fetch(script.src);
                    if (!scriptContents[script.src]) {
                        scriptContents[script.src] = newScript;
                    }
                    if (scriptContents[script.src] !== newScript) {
                        if (script.isModular || script.reset) {
                            let refresh = true;
                            if (script.reset) {
                                if (script.reset() === false) {
                                    refresh = false;
                                }
                            }
                            if (refresh) {
                                let scriptUrl = script.src;
                                script.remove();
                                scriptContents[script.src] = undefined;
                                delete document.evalScripts[script.src];
                                await req(scriptUrl);
                            }

                        } else {
                            if (location.href.includes('localhost')) {
                                location.reload();
                            }
                        }
                    }
                } catch (e) {
                    console.log('failed fetching ' + url, e);
                }

            }
        }
    },
    reset: (obj) => {
        clearInterval(obj.intervalId);
    }
});