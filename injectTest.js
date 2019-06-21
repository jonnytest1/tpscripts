/// <reference path="customTypes/index.d.ts" />

/**
 * @type {HTMLOrSVGScriptElement & CustomScript } 
 */
const injScr = document.currentScript;
injScr.isAsync = true;

document.currentScript.onerror("done");