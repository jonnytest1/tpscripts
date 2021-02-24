/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var amazon$de$progress$tracker = new EvalScript('', {
    waitForResolver: false,
    run: async (resolv, set) => {
        setTimeout(() => location.reload(), (1000 * 60 * 10));

    },
    reset: (set) => {
        //
    }
});