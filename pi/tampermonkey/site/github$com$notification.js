/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var github$com$notification = new EvalScript('', {
    waitForResolver: false,
    run: async (resolv, set) => {
        const menu = sc.menu.addToMenu({
            name: 'refresh',
            type: 'timedRotate',
            rotation: 0,
            typeOptions: {
                duration: 1000 * 60 * 10,
                onFinished: () => {
                    location.reload();
                }
            }
        });
    },
    reset: (set) => {
        //
    }
});