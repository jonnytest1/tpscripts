/* gloabl GMnot */

async function toDataURL(url) {
    return fetch(url)
        .then(r => r.blob())
        .then(async text => {
            return new Promise(res => {
                var reader = new FileReader();
                reader.onloadend = () => {
                    res(reader.result);
                };
                reader.readAsDataURL(text);
            });
        });
}

/**
 *
 * @typedef  {{
    *   timeout: number,
    *   title: string
*       body?:string
*       image: string;
 *      href?: string;
 *      onclick(): void;
 * }} not_options
 *
 *
 * @typedef {{
 *  timeout:number,
 *  title:string
 *  text :string,
 *  image :string,
 *  onclick:()=>any
 * }} GM_not_optinos
 *
 * @param {string|not_options} title
 * @param {string|not_options} [detailsOrIcon]
 * @param {Function} [onclick]
 * @param {string} [openurl]
 * @param {number} [timeout]
 * @param {string} [host]
 * @param {Function} [ondone]
 * @global
 */
//tslint:disable-next-line variable-name
var GMnot = async (title = '', text = '   ', detailsOrIcon = '', onclick, openurl, timeout, host, ondone) => {
    /**
     * @type {GM_not_optinos}
     */
    let details = {};
    if(!timeout) {
        details.timeout = 12000;
    }
    if(!host) {
        host = location.host;
    }
    if(!ondone) {
        ondone = () => { return; };
    }
    if(typeof title !== 'string') {
        details = { ...title, text: title.body };
        if(!details.timeout) {
            details.timeout = timeout;
        }
        if(details.image) {
            // details.image=await toDataURL(details.image);
        }
        return window['GM_notification'](details, details.onclick);
    }
    if(typeof detailsOrIcon !== 'string') {
        details.title = title;
        details.text = detailsOrIcon.body;
        if(!details.timeout) {
            details.timeout = timeout;
        }
        if(details.image) {
            //details.image=await toDataURL(details.image);
        }
        return window['GM_notification'](details, details.onclick);
    }
    if(detailsOrIcon === '') {
        details.image = 'http://icons.iconarchive.com/icons/icons8/windows-8/512/Programming-System-Task-icon.png';
    }
    details.title = title;
    details.text = text;
    details.image = detailsOrIcon;
    if(details.image) {
        details.image = await toDataURL(details.image);
    }
    details.timeout = timeout;
    details.onclick = () => {
        if(onclick) {
            onclick();
        }
    };
    console.trace(details);
    logKibana('DEBUG', { ...details, href: location.href });
    return window['GM_notification'](details, ondone);
};
var notResponse = {
    gmNot: GMnot
};
/**
 * @typedef {typeof notResponse} notificationI
 */
new EvalScript('').finish(notResponse);