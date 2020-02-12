/// <reference path="../../customTypes/index.d.ts" />
/// <reference path="./spider.js" />
/**
 * @type {{type:EvalScript<{container:HTMLElement}>}}
 */
var overview = new EvalScript('', {
    run: async (resolv, set) => {
        const tableClassPromise = reqS('DOM/table');
        const singlerequestPromise = reqS('site/brandad/singlerequest');
        /**
         *
         * @param {Dialog} dialog
         */
        async function displayForms(dialog) {

            dialog.addControl({
                title: 'clear',
                callback: () => {
                    sc.G.s('restRequests', {});
                    sc.G.s('form', {});
                    sc.G.s('otherRequests', {});
                },
                controlKey: 'clear'

            });
            /**
             * @type {Object.<string,RequestStorage>}
             */
            const forms = { ...sc.G.g('restRequests', {}), ...sc.G.g('form', {}), ...sc.G.g('otherRequests', {}) };
            /**
             * @type {TableData}
             */
            const data = Object.values(forms)
                .map(reqData => {

                    const url = new URL(reqData.url);
                    /**
                     * @type {TableRowData}
                     */
                    let row = [
                        { data: `${url.pathname}` },
                        { data: reqData.method },
                    ];

                    if(reqData.headers) {
                        row.push({ data: reqData.headers });
                    }
                    if(reqData.params) {
                        /**
                         * @type {CellOptions}
                         */
                        const params = {};
                        if(typeof reqData.params === 'string') {
                            params.data = reqData.params;
                        } else {
                            /**
                             * @type {Object.<string,string>}
                             */
                            let paramMap = {};
                            reqData.params.forEach(param => {
                                paramMap[param[0]] = param[1];
                            });
                            params.data = paramMap;
                        }
                        row.push(params);
                    }
                    return row;
                });
            console.log('table');
            let table = new (await tableClassPromise)({
                filter: true,
                rows: data,
                rowMapper: (row, i, rows) => {
                    if(i !== 0) {
                        row.style.borderTop = '1px solid black';
                    }
                    row.addEventListener('click', async event => {
                        let url = rows[0];
                        if(typeof url === 'string') {
                            // oO
                        } else {
                            const urlValue = url.data;
                            if(typeof urlValue === 'string') {
                                let singlerequest = await singlerequestPromise;
                                dialog.addContent({
                                    content: await singlerequest(dialog, urlValue, forms)
                                });
                            }
                        }
                    });
                }
            });

            set.container = table.createDom();

            dialog.addContent({ content: set.container, title: 'clear' });
        }
        resolv(displayForms);
    },
    reset: (set) => {
        //
    }
});