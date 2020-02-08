/// <reference path="./libs/eval-script.js" />
/// <reference path="./libs/require.js" />
console.log('entrypoint');
/**@type {Document&{window?}} */
const d = document;
for(let att in d.window) {
    if(att.startsWith('GM_') || att === 'reqS' || att === 'req' || att === 'finished') {
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
/** @type {scI} */
var sc = {
    D: {
        //created element id counter
        n: 0
    },
    menuContainer: baseContainer
};

window.sc = sc;
var querydoc = (identifier) => {
    /**@type {HTMLElement} */
    const value = document.querySelector(identifier);
    return value;
};
globalThis.querydoc = querydoc;

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
 *  stack?:string
 *  remove:Function
 *  afterReset?:Function
 *  requiredFrom?:Array<string>
 * }} CustomScript
 *
 * @typedef {CustomScript&{
 *  resolvers?:Array<Function>,
 *  dispatchEvent:Function,
 *  addEventListener:Function,
 *  remove:Function,
 * }} CustomEvalScript
 *
 *
 *  @typedef {HTMLOrSVGScriptElement & CustomScript } CustomHTMLscript
*/
new Promise(async (resolver) => {
    //console.log('canInject returned ' + baseContainer.canInject);
    let Storage_greaseStorage = IMPORT;

    await reqS('libs/eval-script');

    await reqS('libs/log-level');

    await reqS('libs/log/logging');

    await reqS('notification');

    await reqS('DOM/dependencyCheck');
    console.log('loaded dependencyCheck');

    /**@type {ElementGetter} */
    let find = await reqS('find');
    // eslint-disable-next-line no-unused-vars
    let overwrites = IMPORT;

    await reqS('DOM/CircularMenu');

    await reqS('test/php/testing');
    //tslint:disable-next-line variable-name

    resolver({});

    //index.php adds here
    //tslint:disable-next-line
})
