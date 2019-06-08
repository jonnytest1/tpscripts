/* gloabl GMnot */

/**
 * @param {*} [details_icon]
 * @param {Function} [onclick]
 * @param {string} [openurl]
 * @param {number} [timeout]
 * @param {string} [host]
 * @param {Function} [ondone]
 * @global
 */


var GMnot = (title = "", text = "   ", details_icon = "", onclick = () => { }, openurl, timeout, host, ondone) => {
    if (!timeout) {
        timeout = 12000;
    }
    if (!host) {
        host = location.host;
    }
    if (!ondone) {
        ondone = () => { };
    }
    if (details_icon.image) {
        details_icon.title = title;
        details_icon.text = details_icon.body;
        if (!details_icon.timeout) {
            details_icon.timeout = timeout;
        }
        return window['GM_notification'](details_icon, ondone);
    }
    if (details_icon === "") {
        details_icon = "http://icons.iconarchive.com/icons/icons8/windows-8/512/Programming-System-Task-icon.png";
    }
    let details = {};
    details.title = title;
    details.text = text;
    details.image = details_icon;
    details.timeout = timeout;
    details.onclick = function () {
        onclick.call(this);
    };
    console.trace(details);
    return window['GM_notification'](details, ondone);
};
