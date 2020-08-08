/* gloabl GMnot */

/**
 * @param {*} [detailsOrIcon]
 * @param {Function} [onclick]
 * @param {string} [openurl]
 * @param {number} [timeout]
 * @param {string} [host]
 * @param {Function} [ondone]
 * @global
 */
//tslint:disable-next-line variable-name
var GMnot = (title = '', text = '   ', detailsOrIcon = '', onclick, openurl, timeout, host, ondone) => {
    if(!timeout) {
        timeout = 12000;
    }
    if(!host) {
        host = location.host;
    }
    if(!ondone) {
        ondone = () => { return; };
    }
    if(detailsOrIcon.image) {
        detailsOrIcon.title = title;
        detailsOrIcon.text = detailsOrIcon.body;
        if(!detailsOrIcon.timeout) {
            detailsOrIcon.timeout = timeout;
        }
        return window['GM_notification'](detailsOrIcon, ondone);
    }
    if(detailsOrIcon === '') {
        detailsOrIcon = 'http://icons.iconarchive.com/icons/icons8/windows-8/512/Programming-System-Task-icon.png';
    }
    let details = {};
    details.title = title;
    details.text = text;
    details.image = detailsOrIcon;
    details.timeout = timeout;
    details.href = location.href;
    details.onclick = () => {
        if(onclick) {
            onclick();
        }
    };
    console.trace(details);
    logKibana('DEBUG', details);
    return window['GM_notification'](details, ondone);
};
var notResponse = {
    gmNot: GMnot
};
/**
 * @typedef {typeof notResponse} notificationI
 */
new EvalScript('').finish(notResponse);