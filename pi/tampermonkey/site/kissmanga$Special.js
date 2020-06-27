/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var kissmanga$Special = new EvalScript('', {
    run: async (resolv, set) => {
        reqS('site/kissanime/areyouhuman');

    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
kissmanga$Special;