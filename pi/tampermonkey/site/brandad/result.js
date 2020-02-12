/// <reference path="../../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var result = new EvalScript('', {
    run: async (resolv, set) => {
        /**
     *
     * @param {Dialog} dialog
     * @param {Array<{request:string,response:string}>} attackResults
     */
        async function displayResult(dialog, attackResults) {
            dialog.addContent(new (await reqS('DOM/table'))({
                rows: attackResults.map(res => {
                    const request = JSON.parse(res.request);
                    const response = JSON.parse(res.response);
                    return [{
                        data: {
                            request: {
                                data: [{
                                    data: {
                                        url: request.url,
                                        method: request.method,
                                    }
                                }]
                            }, response: {
                                data: [{
                                    data: {
                                        status: `${response.status}`,
                                        body: response.body || ''
                                    }
                                }]
                            }
                        },
                        helperData: {
                            request, response
                        }
                    }];
                }),
                rowMapper: (row, i, rows, level) => {
                    if(i % 2 === 0 && level !== 2) {
                        row.style.borderTop = '1px solid black';
                    }
                },
                cellMapper: (cell, obj, i, row, level) => {
                    console.log(cell.textContent, obj, i, row, level);
                    if(i === 0 && level !== 2) {
                        cell.style.width = '100px';
                    }
                    if(obj.helperData) {
                        let color = 'green';
                        if(obj.helperData.request.validMethod === (obj.helperData.response.status === 405)) {
                            color = 'red';
                        }
                        cell.style.backgroundColor = color;

                    }

                }
            }).createDom());
        }
        resolv(displayResult);
    },
    reset: (set) => {
        //
    }
});