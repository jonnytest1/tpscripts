/// <reference path="../../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var singlerequest = new EvalScript('', {
    run: async (resolv, set) => {
        var tableClassPromise = reqS('DOM/table');
        const bruteForcePromise = reqS('site/brandad/attack');
        const displayResultPromise = reqS('site/brandad/result');
        /**
         *
         * @param {string} urlValue
         * @param {Object.<string,RequestStorage>} requests
         * @param {Dialog} dialog
         */
        async function requestOverView(dialog, urlValue, requests) {
            const requestElement = document.createElement('div');

            const currentRequest = requests[urlValue];

            // requestElement.textContent = urlValue;

            // @ts-ignore
            const searchObject = Object.fromEntries(currentRequest.search);
            let table = new (await tableClassPromise)({
                rows: [
                    ['url', currentRequest.url],
                    ['method', currentRequest.method],
                    ['search', { data: searchObject }],
                    ['params', { data: currentRequest.params }],
                    ['headers', { data: currentRequest.headers }],
                    ['options', [{
                        data: 'test',
                        onclick: async () => {
                            const bruteForce = await bruteForcePromise;

                            const result = await bruteForce(currentRequest);

                            (await displayResultPromise)(dialog, result);

                        }
                    }]
                    ]

                ],
                rowMapper: (row, i, rows) => {
                    if(i !== 0) {
                        row.style.borderTop = '1px solid black';
                    }
                }
            });
            requestElement.appendChild(table.createDom());

            return requestElement;

        }
        resolv(requestOverView);
    },
    reset: (set) => {
        //
    }
});