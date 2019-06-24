/// <reference path="../customTypes/index.d.ts" />

let c = { zIndex: 2099999999 };
/**
 * @typedef {typeof c} DConstants
 */
new EvalScript('').finish(c);
