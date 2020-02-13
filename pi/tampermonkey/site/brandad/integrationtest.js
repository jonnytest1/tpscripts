/// <reference path="../../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{menu:HTMLElement}>}}
 */
var integrationtest = new EvalScript('', {
    run: async (resolv, set) => {
        (async () => {

            const tableClass = await reqS('DOM/table');

            /**
             * @param {HTMLElement} element
             */
            function hasParent(element, callback) {
                if(element !== document.body) {
                    if(callback(element)) {
                        return true;
                    }
                    return hasParent(element.parentElement, callback);
                }
                return false;
            }

            function testMode() {
                if(sc.G.g('basTestModeEnabled', false) === true) {
                    console.log('interceptin click');

                    document.body.addEventListener('click', event => {
                        try {
                            handleClick(event);
                        } catch(e) {
                            console.error(e);
                        }
                        // @ts-ignore
                        if(set.menu && !hasParent(event.target, el => el.isMenu === true)) {
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }, true);
                }

                /**
                *
                * @param {MouseEvent} event
                */
                function handleClick(event) {
                    /**
                     * @type {HTMLElement}
                     */
                    // @ts-ignore
                    const target = event.srcElement;
                    if(!set.menu && event.isTrusted && sc.G.g('basTestModeEnabled', false) === true) {
                        set.menu = document.createElement('div');
                        // @ts-ignore
                        set.menu.isMenu = true;
                        const table = new tableClass({
                            rows: [[{
                                data: 'click',
                                onclick: () => {
                                    const selector = getSelector(target);
                                    console.log('adding ' + target.innerText + '  ' + selector);
                                    sc.G.p('basTestingRoute', { selector, textContent: target.textContent || target.innerText });
                                    target.click();
                                    set.menu.remove();
                                    set.menu = undefined;
                                    target.click();
                                }
                            }],
                            [{ data: 'evaluate' }],
                            [{
                                data: 'finalize', onclick: () => {
                                    sc.G.s('basTestModeEnabled', false);
                                    set.menu.remove();
                                    set.menu = undefined;
                                    // TODO: display chain

                                }
                            }],
                            [{ data: 'display' }]
                            ]
                        }).createDom();

                        //table.style.border = '1px solid black';
                        table.style.backgroundColor = 'white';
                        table.style.width = table.style.height = 'fit-content';
                        table.style.boxShadow = 'rgba(82, 74, 74, 0.32) 0px -1px 7px 5px';

                        set.menu.appendChild(table);
                        set.menu.style.position = 'fixed';
                        set.menu.style.zIndex = '9999999';
                        set.menu.style.left = event.x + 'px';
                        set.menu.style.top = event.y + 'px';
                        document.body.appendChild(set.menu);
                    }
                    console.log(event);
                }
            }
            /**
             * @returns {string}
             * @param {HTMLElement} target
             */
            function getSelector(target) {
                if(target.id) {
                    return target.id;
                }
                return 'todo';

            }

            resolv(testMode);
        })();
        return true;

    },
    reset: (set) => {
        //
    }
});