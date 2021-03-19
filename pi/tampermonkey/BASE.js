/// <reference path="./libs/eval-script.js" />
/// <reference path="./libs/require.js" />
/// <reference path="./customTypes/declarations.d.ts" />
/// <reference path="./Storage/storage.d.ts" />
console.log('entrypoint');
/**@type {Document&{window?}} */
const d = document;
for(let att in d.window) {
    if(att.startsWith('GM_') || att === 'reqS' || att === 'req' || att === 'backendUrl' || att === 'finished') {
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
/** @type {import('./customTypes/declarations').scI} */
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
 *  persist?:()=>Array<string>
 *  requiredFrom?:Array<string>,
 *  options?:any
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
    let overwrites = IMPORT;
    //console.log('canInject returned ' + baseContainer.canInject);

    await reqS('libs/eval-script');

    const [base] = await reqS(['Storage/greaseBase', 'Storage/storageimpl']);

    sc.G = new StorageImplementation(base);

    await reqS(['libs/log-level', 'libs/log/logging',]);

    await reqS('notification', 'DOM/dependencyCheck');
    //console.log('loaded dependencyCheck');

    // eslint-disable-no-unused-vars
    let [find] = await reqS(['find', 'DOM/CircularMenu']);

    reqS('test/php/testing');
    //tslint:disable-next-line variable-name

    resolver({});

    //index.php adds here
    //tslint:disable-next-line
})
