/// <reference path="../../customTypes/index.d.ts" />
/**
 * @type {EvalScript<{container:HTMLElement,dialog:Dialog}>}
 */
var brandadmain = new EvalScript('', {
    run: async (resolv, set) => {

        const dialogClassPromise = reqS('DOM/dialog');

        const tableClassPromise = reqS('DOM/table');
        const testerPromise = reqS('site/brandad/test/tester');
        const requestOverviewPromise = reqS('site/brandad/requestoverview');
        const testPromise = reqS('site/brandad/test/integrationtest');

        document.addEventListener('keypress', async event => {
            // ctrl + M
            if(event.charCode === 10 && event.ctrlKey === true) {
                mainForm();
            }
        });

        async function mainForm() {

            set.dialog = new (await dialogClassPromise)({
                addControls: true,
                contents: [
                    {
                        content: new (await tableClassPromise)({
                            rows: [
                                [{
                                    data: 'pentest',
                                    onclick: async () => (await requestOverviewPromise)(set.dialog)
                                }],
                                [{
                                    data: 'testmode',
                                    onclick: async () => {
                                        set.dialog.remove();
                                        sc.G.s('basTestModeEnabled', !sc.G.g('basTestModeEnabled', false));
                                        (await testPromise)();
                                    }
                                },
                                {
                                    data: sc.G.g('basTestModeEnabled', false) ? '✔' : '❌'
                                }], [
                                    {
                                        data: 'tester',
                                        onclick: async () => {
                                            (await testerPromise)(set.dialog);
                                        }
                                    }
                                ]
                            ]
                        }).createDom()
                    }
                ]
            });

        }

    },
    reset: (set) => {
        if(set.dialog) {
            set.dialog.remove();
        }
    }
});