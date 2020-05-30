/// <reference path="../../../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{dialog:Dialog}>}}
 */
var tester = new EvalScript('', {
    run: async (resolv, set) => {

        const tableClassPromise = reqS('DOM/table');

        /**
         *
         * @param {Dialog} dialog
         */
        async function testerFactory(dialog) {
            set.dialog = set.dialog || dialog;

            const table = new (await tableClassPromise)({
                rows: sc.G.g('basFinshedTests', [])
                    .map(testCase => [{
                        data: testCase.name,
                        onclick: () => {
                            //TODO: display steps
                        }
                    }, {
                        data: 'replay', onclick: () => {
                            //
                        }
                    }])
            }).createDom();
            set.dialog.addContent(table);
        }
        // test asd asd asd asd
        resolv(testerFactory);

        if(set.dialog) {
            testerFactory(set.dialog);
        }
    },
    persist: () => ['dialog'],
    reset: (set) => {
        //
    }
});