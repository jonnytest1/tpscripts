/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var github$com$notification = new EvalScript('', {
    waitForResolver: false,
    run: async (resolv, set) => {
        const menu = sc.menu.addToMenu({
            name: 'refresh',
            type: 'rotate',
            typeOptions: {
                duration: 1000 * 60 * 10,
                onFinished: () => {
                    location.reload();
                }
            }
        });
        const customTime = new CustomTime();
        customTime.waitFor({
            duration: menu.typeOptions.duration,
            callback: () => {
                menu.typeOptions.onFinished();
            },
            onStep: (percent) => {
                if(menu.element) {
                    menu.element.typeAttributes.rotator.setPercent(1 - percent);
                    menu.element.typeAttributes.rotator.blink();
                }
            }
        });
    },
    reset: (set) => {
        //
    }
});