/* tslint:disable no-invalid-this  */
///<reference path="../libs/eval-script.js" />
/**
 * @type {EvalScript<{container:HTMLElement,dialog:Dialog}>}
 */
var b = new EvalScript('', {
    // @ts-ignore
    run: async (re, set) => {
        function shouldRun() {
            if(!location.origin.includes('localhost')
                && !location.origin.includes('.test.brandad.de')
                && !location.origin.includes('.livekopie.brandad.de')
                && !location.origin.includes('.abnahme.brandad.de')) {
                console.error('disabled spider origin match');
                return false;
            }

            if(!location.href.includes('brandbase')
                && !location.href.includes('mios')
                && !location.href.includes('audi')
                && !location.href.includes('dsv')
                && !location.href.includes('allianz')
                && !location.href.includes('mr')
                && !location.href.includes('cdag')) {
                console.error('disabled spider customer match');
                return false;
            }
            console.log('spider enabled');
            return true;
        }
        if(!shouldRun()) {
            return;
        }

        var tableClassPromise = reqS('DOM/table');

        var dialogClassPromise = reqS('DOM/dialog');
        /**
         * @typedef {XMLHttpRequest & {
         * headers:Object.<string,string>
         * requestUri:URL,
         * requestMethod:RequestMethod
         * }} XMLHttpRequestOverwrite
         *
         *
         * @typedef {"GET"|"POST"} RequestMethod
         *
         * @typedef {{
         * url:string,
         * method:RequestMethod,
         * params:Array<Array<string>>|string,
         * headers:Object.<string,string>,
         * search:[string, string][],
         * timestamp:number
         * }} RequestStorage
         */

        document.addEventListener('keypress', async event => {
            // ctrl + M
            if(event.charCode === 10 && event.ctrlKey === true) {

                displayForms();
            }
        });

        async function displayForms() {

            set.dialog = new (await dialogClassPromise)();
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
                        { data: `${url.origin}${url.pathname}` },
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
                                set.dialog.addContent({
                                    content: await requestOverView(urlValue, forms)
                                });
                            }
                        }
                    });
                }
            });

            set.container = table.createDom();
            const clear = document.createElement('clear');
            clear.textContent = 'clear';
            clear.onclick = () => {
                sc.G.s('restRequests', {});
                sc.G.s('form', {});
                sc.G.s('otherRequests', {});
            };
            set.container.appendChild(clear);

            set.dialog.addContent({ content: set.container });
        }
        /**
         *
         * @param {Array<{request:string,response:string}>} result
         */
        async function displayResult(result) {

            set.dialog.addContent(new (await tableClassPromise)({
                rows: result.map(res => {
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

        /**
         *
         * @param {RequestStorage} request
         * @returns {Promise<Array<{request:string,response:string}>>}
         */
        async function bruteForce(request) {
            const url = new URL(request.url);

            const requestUrl = `${url.origin}${url.pathname}`;

            const methods = ['GET', 'POST', 'PUT', 'DELETE'];

            const errorStrings = ['%2F___', '',];

            const results = [];
            for(let method of methods) {
                // @ts-ignore
                for(let key in Object.fromEntries(request.search)) {

                    for(let errorString of errorStrings) {
                        url.searchParams.set(key, errorString);

                        const currentRequest = {
                            url: url.href,
                            method: method,
                            validMethod: method === request.method,
                        };

                        const result = await fetch(currentRequest.url, currentRequest);
                        let body;
                        if(result.status < 300) {
                            body = await result.text();
                        }
                        results.push({
                            request: JSON.stringify(currentRequest),
                            response: JSON.stringify({ body, status: result.status })
                        });
                    }

                }
            }

            return results;

        }

        /**
         *
         * @param {string} urlValue
         * @param {Object.<string,RequestStorage>} requests
         */
        async function requestOverView(urlValue, requests) {
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
                        onclick: () => {
                            bruteForce(currentRequest)
                                .then(result => {
                                    displayResult(result);
                                });
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

            const back = document.createElement('div');
            back.textContent = 'back';
            back.onclick = () => {
                set.dialog.back();
            };
            requestElement.appendChild(back);

            return requestElement;

        }

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, uri, ...args) {
            // @ts-ignore
            this.requestMethod = method;
            // @ts-ignore
            this.requestUri = getRequestURL(uri);
            return originalOpen.call(this, method, uri, ...args);
        };

        const originalsetHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
            try {
                // @ts-ignore
                setHeader(this, key, value);
            } catch(error) {
                debugger;
            }
            return originalsetHeader.call(this, key, value);
        };
        /**
         *
         * @param {XMLHttpRequestOverwrite} request
         * @param {*} key
         * @param {*} value
         */
        function setHeader(request, key, value) {
            if(!request.headers) {
                request.headers = {};
            }
            request.headers[key] = value;
        }

        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(data) {
            try {
                // @ts-ignore
                checkRequest(this, data);
            } catch(error) {
                debugger;
            }
            return originalSend.call(this, data);
        };
        /**
         *
         * @param {XMLHttpRequestOverwrite} request
         * @param {*} data
         */
        function checkRequest(request, data) {
            const requestUrl = request.requestUri;
            if(requestUrl.pathname.endsWith('.do')) {
                addRequest(request, data, 'form');
            } else if(requestUrl.pathname.includes('rest/')) {
                addRequest(request, data, 'restRequests');
            } else if(!request.requestUri.href.includes('blob:')) {
                addRequest(request, data, 'otherRequests');
            }
            console.log(request, data);
        }
        /**
         *
         * @param {XMLHttpRequestOverwrite} request
         * @param {any} data
         * @param {'otherRequests'|'form'|'restRequests'} gmField
         */
        function addRequest(request, data, gmField) {
            let requests = sc.G.g(gmField, {});

            requests[request.requestUri.origin + request.requestUri.pathname] = getRequestObject(request, data, requests[request.requestUri.origin + request.requestUri.pathname]);

            sc.G.s(gmField, requests);
        }

        function getRequestURL(path) {
            if(!path.startsWith('http')) {
                if(!path.startsWith('/')) {
                    path = '/' + path;
                }
                path = location.origin + path;
            }
            return new URL(path);
        }

        /**
         *
         * @param {XMLHttpRequestOverwrite} request
         * @param {any} data
         * @param {RequestStorage} [previous]
         * @returns {RequestStorage}
         */
        function getRequestObject(request, data, previous) {
            /**
             * @type {Array<Array<string>>|string}
             */
            let params = null;
            if(data) {
                if(data instanceof FormData) {
                    let formData = '';
                    const entries = [...data.entries()];
                    for(let i = 0; i < entries.length; i++) {
                        const entry = entries[i];
                        formData += `${encodeURIComponent(entry[0])}=${encodeURIComponent(entry[1].toString())}`;
                        if(i < entries.length - 1) {
                            formData += '&';
                        }
                    }
                    data = formData;
                } else {
                    try {
                        JSON.parse(data);
                        params = data;
                    } catch(exception) {
                        const paramParts = data.split('&');
                        params = paramParts.map(part => part.split('=')
                            .map(decodeURIComponent));
                    }
                }
            }
            const href = request.requestUri.href;
            const search = [...request.requestUri.searchParams];
            if(previous) {
                for(let searchParam of previous.search) {
                    if(!search.some(entry => entry[0] === searchParam[0])) {
                        debugger;
                        search.push(searchParam);
                    }
                }
            }
            return {
                url: href,
                search: search,
                //requestedUri:request.__zone_symbol__xhrURL,
                params,
                method: request.requestMethod,
                headers: request.headers,
                timestamp: previous.timestamp || Date.now()
            };

        }
    }, reset: (data) => {
        if(data.container) {
            data.container.remove();
        }
    }
});