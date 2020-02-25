/// <reference path="../../../customTypes/index.d.ts" />
/**
 * @typedef TestingRouteEvent
 * @property {string} selector
 * @property {string} id
 * @property {string} className
 * @property {string} tagName
 * @property {string} text
 * @property {string} test
 * @property {"click"|"input"|'evaluate'} mode
 * @property {string} url
 */

/**
 * @type {{type:EvalScript<{menu:HTMLElement}>}}
 */
var integrationtest = new EvalScript('', {
    run: async (resolv, set) => {
        (async () => {

            const tableClass = await reqS('DOM/table');
            const selectorPromise = reqS('libs/dom/selector');
            const dialogPromise = reqS('DOM/dialog');

            /**
             *
             * @param {TestingRouteEvent} event
             */
            function addTestEvent(event) {
                sc.G.p('basTestingRoute', event);
            }

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
            /**
             *
             * @param {HTMLElement} target
             * @param {*} event
             */
            function createMenu(target, event) {
                set.menu = document.createElement('div');
                // @ts-ignore
                set.menu.passThrough = true;
                let buttons = [
                    [{
                        data: 'click',
                        onclick: () => {
                            clickEvent(target);
                        }
                    }],
                    [{
                        data: 'evaluate',
                        onclick: async () => {
                            let value = prompt('evaluator ? (el) => ');
                            const fnc = new Function('el', 'return ' + value);
                            //console.log(fnc(target));
                            addTestEvent(await createTestEvent(target, 'evaluate', fnc));
                            set.menu.remove();
                            set.menu = undefined;

                        }
                    }],
                    [{
                        data: 'finalize',
                        onclick: () => {
                            sc.G.s('basTestModeEnabled', false);

                            displayTestRoute(() => {
                                sc.G.p('basFinshedTests', { name: prompt('test name', ''), steps: sc.G.g('basTestingRoute', []) });
                                sc.G.s('basTestingRoute', []);
                            });
                            sc.G.s('basTestModeEnabled', false);
                        }
                    }],
                    [{
                        data: 'display',
                        onclick: displayTestRoute
                    }], [{
                        data: 'findAny',
                        onclick: () => {
                            console.log('create selector with attributes of current Element (tagName className text etc)');
                        }
                    }]
                ];
                if(target.tagName === 'INPUT') {
                    /**
                     * @type {HTMLInputElement}
                     */
                    // @ts-ignore
                    const castedTarget = target;
                    if(castedTarget.type !== 'submit') {
                        buttons.push([{
                            data: 'setValue',
                            onclick: () => setValue(castedTarget)
                        }]);
                    }

                }
                const table = new tableClass({
                    rows: buttons
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
                        if(set.menu && !hasParent(event.target, el => el.passThrough === true)) {
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }, true);

                    document.body.addEventListener('keypress', event => {
                        try {
                            console.log(event);
                        } catch(e) {
                            console.error(e);
                        }
                    }, true);
                }

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
                if(!set.menu && event.isTrusted && sc.G.g('basTestModeEnabled', false) === true && !hasParent(target, el => el.passThrough === true)) {
                    createMenu(target, event);
                }
                console.log(event);

            }

            /**
             *
             * @param {HTMLElement} element
             * @param {"click"|"input"|'evaluate' } mode
             * @param {Function} [test]
             * @returns {Promise<TestingRouteEvent>}
             */
            async function createTestEvent(element, mode, test) {
                const selector = (await selectorPromise)(element);
                return {
                    mode,
                    text: element.textContent || element.innerText,
                    test: `${test}`,
                    id: element.id,
                    className: element.className,
                    tagName: element.tagName,
                    selector,
                    url: location.href
                };
            }

            /**
             *
             * @param {HTMLElement} target
             */
            async function clickEvent(target) {

                //console.log('adding ' + target.innerText + '  ' + selector);
                addTestEvent(await createTestEvent(target, 'click'));
                set.menu.remove();
                set.menu = undefined;
                target.click();
                target.focus();
            }

            /**
             *
             * @param {HTMLInputElement} target
             */
            async function setValue(target) {

                /**
                 * @type {string|number}
                 */
                let value = prompt('set to which value ?');
                target.value = value;
                if(target.type === 'number') {
                    value = Number(value);
                }
                addTestEvent(await createTestEvent(target, 'input', () => `${value}`));
                set.menu.remove();
                set.menu = undefined;

            }
            /**
             * @param {()=>void} removeListener
             */
            async function displayTestRoute(removeListener) {
                set.menu.remove();
                set.menu = undefined;
                /**
                 * @type { TableData}
                 */
                const tableData = sc.G.g('basTestingRoute', [])
                    .map(/**@param {TestingRouteEvent} testEvent*/ /**@param {TestingRouteEvent} testEvent*/ testEvent => {
                        return [{
                            data: Object.entries(testEvent)
                        }];
                    });
                const tableElement = new tableClass({
                    rows: tableData,
                    cellMapper: (cell, obj, i, row, level) => {
                        if(i === 0 && level !== 2) {
                            cell.style.width = '100px';
                        }
                    },
                    rowMapper: (row, i, r, level) => {
                        if(i % Object.entries(tableData[0]).length === 0) {
                            row.style.borderTop = '1px solid black';
                        }
                        if(i % 2 === 0 && level === 0) {
                            row.style.backgroundColor = 'gainsboro';
                        }
                    }
                }).createDom();
                const dialog = new (await dialogPromise)({
                    onremove: removeListener,
                    contents: [{
                        content: tableElement
                    }]
                });
                // @ts-ignore
                tableElement.passThrough = true;
                tableElement.onclick = e => {
                    dialog.remove();
                };
            }

            resolv(testMode);
        })();
        return true;

    },
    reset: (set) => {
        //
    }
});