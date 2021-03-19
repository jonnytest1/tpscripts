/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {EvalScript<{customtimes:Array<CustomTime>},TypeRegistration<"rotate">>}
 */
var rotationMenu = new EvalScript('', {
    waitForResolver: true,
    run: async (resolv, set) => {
        let [_] = await reqS(['DOM/customSlider', 'time']);
        const test = 5;
        /**
         * @type {CreateElement}
         */
        function createRotator(parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, context) {
            /**
             * @type {CircularMenuHTMLButton<"rotate">}
             */
            const button = context.menu.createElement(parent, text, onclick, fncmouseEnter, fncMouseLeave, style, center, angle, context);
            /**
             * @type {MenuElementItem<"rotate">}
             */
            const element = context.currentButton;
            const startPercent = element.typeOptions.startPercent || 0;
            const rotationSlider = new CustomSlider(parent, center, undefined, (1 - startPercent) * 100, {
                scale: 0.5,
                color: 'red',
                arcWidth: 7,
                skipMouseMove: true,
                viewRotation: 90 + angle
            });
            rotationSlider.container.style.zIndex = '2199999999';
            button.typeAttributes = {
                rotator: rotationSlider
            };
            return button;
        }
        /**
         * @type {RegistrationFunction}
         */
        function configure(item) {
            item.creationFunction = createRotator;
        }

        setTimeout(() => {

            resolv(['rotate', configure]);
        });
        return true;
    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
rotationMenu;