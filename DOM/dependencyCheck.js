/**@type {CustomHTMLscript}*/
var depCheckScript = document.currentScript
depCheckScript.isModular = true;
var intervalId;
depCheckScript.reset = () => {
    clearInterval(intervalId);
}

var scriptContents = {}
var url = "http://localhost:4280?url=" + location.href;
function getSCriptsArray() {
    return [...document.body.getElementsByTagName("script")];
}

(async function initAutoRefresh() {
    await reqS("http");

    /** @type {Array<HTMLScriptElement>} */
    let scripts = getSCriptsArray();
    try {
        scriptContents[url] = await gm_fetch(url);
    } catch (e) {
        console.log("failed fetching " + url)
    }
    for (let script of scripts) {
        if (script.src.includes("localhost")) {
            try {
                scriptContents[script.src] = await gm_fetch(script.src);
            } catch (e) {
                console.log("failed fetching " + script.src)
            }
        }
    }
    console.log("INIT REFRESH !!")

    intervalId = setInterval(scriptCheck, 500);
})();

async function scriptCheck() {
    let scripts = getSCriptsArray();
    for (let script of scripts) {
        await checkScript(script)
    }

    // @ts-ignore
    checkScript({ src: url });
}

/**@param {HTMLScriptElement & CustomScript} script */
async function checkScript(script) {
    if (script.src.includes("localhost")) {
        try {
            let newScript = await gm_fetch(script.src);
            if (!scriptContents[script.src]) {
                scriptContents[script.src] = newScript;
            }
            if (scriptContents[script.src] != newScript) {
                if (script.isModular || script.reset) {
                    if (script.reset) {
                        script.reset();
                    }
                    scriptContents[script.src] = undefined;
                    let url = script.src;
                    script.remove();
                    await req(url);
                } else {
                    location.reload();
                }
            }
        } catch (e) {
            console.log("failed fetching " + url)
        }

    }
}