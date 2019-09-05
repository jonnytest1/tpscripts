/// <reference path="../customTypes/index.d.ts" />
new EvalScript('', {
    run: async () => {

        /**
        *
        * @param {HTMLElement} element
        * @param { (HTMLElement)=>boolean} condition
        * @returns {HTMLElement}
        */
        function getPE(element, condition) {

            if(condition(element)) {
                return element;
            }
            if(element === document.body) {
                return null;
            }

            if(!element.parentElement) {
                return null;
            }
            return getPE(element.parentElement, condition);
        }

        setInterval(() => {
            [...document.querySelectorAll('span')]
                .filter(e => e.attributes['data-content'])
                .filter(e => e.attributes['data-content'].value === 'S')
                .filter(el => window.getComputedStyle(el).display !== 'none')
                .filter(el => getPE(el, e => e.tagName === 'A'))
                .forEach(el => {
                    const parent = getPE(el, e => e.attributes['data-testid'] && e.attributes['data-testid'].value === 'fbfeed_story');
                    debugger;
                    if(parent) {
                        parent.remove();
                    }
                });

        }, 2000);
    }
});