/// <reference path="../../../customTypes/index.d.ts" />
/**
 * @type {EvalScript<{},TypeRegistration<"timedRotate">>}
 */
var timedRotator = new EvalScript('', {
    waitForResolver: true,
    run: async (resolv, set) => {
        await reqS('time');

        console.log('resolving');
        resolv(['timedRotate', (item, types) => {
            types['rotate'](item, types);
            const customTime = new CustomTime();
            customTime.waitFor({
                duration: item.typeOptions.duration,
                callback: () => {
                    item.typeOptions.onFinished();
                },
                onStep: (percent) => {
                    if(item.element) {
                        item.element.typeAttributes.rotator.setPercent(1 - percent);
                        item.element.typeAttributes.rotator.blink();
                    }
                }
            });
        }]);

        return false;
    },
    reset: (set) => {
        //
    }
});
//tslint:disable-next-line
timedRotator;