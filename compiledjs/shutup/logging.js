/* global scriptContent,GM_notification,GM_setClipboard,GM_xmlhttpRequest*/
/// <reference path="customTypes/index.d.ts" />
var logHistory = {};
let prepareScript = () => {
    let lines = scriptContent.split("\n");
    let number = 1;
    return lines.map(str => (number++) + "\t" + str).join("\n");
};
/** @global */
function logKibana(level, message, error) {
    let jsonMessage = message;
    if (!jsonMessage && error) {
        jsonMessage = error.message;
    }
    if (jsonMessage instanceof Object) {
        jsonMessage = JSON.stringify(jsonMessage);
    }
    let jsonData = {
        "Severity": level,
        // "javascript": prepareScript(),
        "application": "clientJS",
        "message": jsonMessage
    };
    if (error) {
        jsonData.error_message = error.message;
        jsonData.error_stacktrace = error.stack;
    }
    GM_xmlhttpRequest({
        method: "PUT",
        url: 'http://192.168.178.38/webserver/log/rewrite',
        headers: {
            "Content-Type": "text/plain"
        },
        data: JSON.stringify(jsonData),
        onerror: console.log,
        onabort: (e) => { debugger; },
        onload: () => { }
    });
}
function evalError(e) {
    if (!e.stack.includes("extension") && !e.stack.includes('<br />')) {
        return;
    }
    handleError(e);
}
/**
 * @param {Error} e
 * @global
 */
function handleError(e) {
    logKibana('ERROR', undefined, e);
    debugger;
    let note = "";
    let scriptMessage = scriptContent;
    const splitScriptContent = scriptMessage.split("error</b>:");
    if (splitScriptContent.length > 2) {
        scriptMessage = splitScriptContent[1];
        note = scriptMessage.replace(/<br \/>\n/gm, "").replace(/<b>/gm, "").replace(/<\/b>/gm, "").replace("Parse error:", "").replace("syntax error,", "").trim();
    }
    else {
        note = e.message;
    }
    if (!logHistory[e.stack] || logHistory[e.stack] < new Date().valueOf() - (1000 * 60)) {
        logHistory[e.stack] = new Date().valueOf();
        //let file = calculateFile(e.stack, prepareScript());
        console.trace(location.href + "\n" + e.stack);
        console.error(location.href + "\n" + e.stack);
        GM_notification({
            title: location.href,
            text: note,
            image: "https://www.shareicon.net/data/128x128/2017/06/21/887388_energy_512x512.png",
            onclick: () => {
                debugger;
                try {
                    let logContent = location.href + "\n" + e.stack;
                    GM_setClipboard(logContent);
                }
                catch (error) {
                    GM_setClipboard(location.href + "\n" + error.stack);
                }
            }
        });
    }
    else {
        console.trace(e.stack + " appeared again not sending");
    }
}
function calculateFile(stack, scriptText) {
    let lineNumber = stack.split("\n")[1].split(":")[1];
    let stacking = 0;
    let lineInFile = 0;
    for (let line = lineNumber - 1; line >= 0; line--) {
        let currebtLine = scriptText.split('\n')[line];
        if (currebtLine.includes('//___file')) {
            if (stacking == 0) {
                return { file: currebtLine.split('/___file=')[1], line: lineInFile };
            }
            stacking--;
            lineInFile--;
        }
        else if (currebtLine.includes('//===file-end=')) {
            stacking++;
            lineInFile--;
        }
        if (stacking == 0) {
            lineInFile++;
        }
    }
    return null;
}
window.evalError = evalError;
window.logKibana = logKibana;
window.handleError = handleError;
window.sc.D.e = handleError;
window.sc.D.l = (message, error) => {
    logKibana('INFO', message, error);
};
