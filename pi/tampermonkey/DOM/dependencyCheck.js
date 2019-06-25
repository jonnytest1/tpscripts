
/// <reference path="../customTypes/index.d.ts" />

new EvalScript('', {
    run: async (resolver, set) => {
        const http = await reqS('http');
        var scriptContents = {};
        var url = 'http://localhost:4280?url=' + location.href;

        /**
         * @returns {Array<HTMLScriptElement>}
         *
         */
        function getSCriptsArray() {
            const evalScripts = Object.entries(document.props.evalScripts);
            if (evalScripts.length > 0) {
                return evalScripts.map(obj => {
                    return obj[1];
                });
            }
            return [...document.body.getElementsByTagName('script')];
        }

        (async function initAutoRefresh() {

            /** @type {Array<HTMLScriptElement>} */
            let scripts = getSCriptsArray();
            try {
                scriptContents[url] = await http.gm_fetch(url);
            } catch (e) {
                console.log('failed fetching ' + url);
            }
            for (let script of scripts) {
                await new Promise(r => setTimeout(r, 500));
                if (script.src.includes('localhost')) {
                    try {
                        scriptContents[script.src] = await http.gm_fetch(script.src);
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
                    let newScript = await http.gm_fetch(script.src)
                        .catch(e => {
                            console.log(`error with script ${script.src} \n${script.stack}`);
                        });

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
                                console.log(`REFRESHING ${script.src}`);
                                let scriptUrl = script.src;
                                script.remove();
                                scriptContents[script.src] = undefined;
                                delete document.props.evalScripts[script.src];
                                await req(scriptUrl, false);
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