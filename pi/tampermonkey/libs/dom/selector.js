/// <reference path="../../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var selectorScript = new EvalScript('', {
    run: async (resolv, set) => {
        resolv(
            /**
             * @param {HTMLElement} element
             */
            function getSelector(element) {

                /**
                 *
                 * @param {HTMLElement} searchElement
                 * @returns {HTMLElement}
                 */
                function findIdParent(searchElement) {
                    if(searchElement.id || searchElement === document.body) {
                        return searchElement;
                    }
                    return findIdParent(searchElement.parentElement);
                }

                const rootParent = findIdParent(element);
                let selector = rootParent === document.body ? 'body' : '#' + rootParent.id;

                if(rootParent === element) {
                    return selector;
                }

                const combined = `${element.tagName}${!element.id ? '' : '#' + element.id}${element.classList.length > 0 ? '.' + [...element.classList].join('.') : ''}`;
                if(rootParent.querySelectorAll(`${selector} ${combined}`).length === 1) {
                    return `${selector} ${combined}`;
                }

                /* if(element.attributes.getNamedItem('id') !== null && rootParent.querySelectorAll(element.tagName).length === 1) {
                    return `${selector} [id="${element.attributes.getNamedItem('id')}"]`;
                } */

                if(rootParent.querySelectorAll(element.tagName).length === 1) {
                    return `${selector} ${element.tagName}`;
                }

                console.warn('couldnt find a direct match with current implementation');
                return '';
            });
    },
    reset: (set) => {
        //
    }
});