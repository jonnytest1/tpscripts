/// <reference path="../../customTypes/index.d.ts" />
/* tslint:disable no-invalid-this  */
/**
 *
 * @typedef {"GET"|"POST"} RequestMethod
 *
 * @typedef {XMLHttpRequest & {
 * headers:Object.<string,string>
 * requestUri:URL,
 * requestMethod:RequestMethod
 * }} XMLHttpRequestOverwrite
 *
 *
 *  @typedef {{
 * url:string,
 * method:RequestMethod,
 * params:Array<Array<string>>|string,
 * headers:Object.<string,string>,
 * search:[string, string][],
 * timestamp:number
 * }} RequestStorage
 *
 */
/**
 * @type {{type:EvalScript<{originalOpen:(method:string,url:string)=>void,originalsetHeader:(name:string,value:string)=>void,originalSend:(data:any)=>void}>}}
 */
var spider = new EvalScript('', {
    run: async (resolv, set) => {

        set.originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, uri, ...args) {
            // @ts-ignore
            this.requestMethod = method;

            // @ts-ignore
            this.requestUri = getRequestURL(uri);
            return set.originalOpen.call(this, method, uri, ...args);
        };

        set.originalsetHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
            try {
                // @ts-ignore
                setHeader(this, key, value);
            } catch(error) {
                debugger;
            }
            return set.originalsetHeader.call(this, key, value);
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

        set.originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(data) {
            try {
                // @ts-ignore
                checkRequest(this, data);
            } catch(error) {
                debugger;
            }
            return set.originalSend.call(this, data);
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

        }
        /**
         *
         * @param {XMLHttpRequestOverwrite} request
         * @param {any} data
         * @param {'otherRequests'|'form'|'restRequests'} gmField
         */
        function addRequest(request, data, gmField) {
            let requests = sc.G.g(gmField, {});

            requests[request.requestUri.pathname] = getRequestObject(request, data, requests[request.requestUri.origin + request.requestUri.pathname]);

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
         * @param {Partial<RequestStorage>} [previous]
         * @returns {RequestStorage}
         */
        function getRequestObject(request, data, previous = {}) {
            /**
             * @type {Array<Array<string>>|string}
             */
            let params = null;
            if(data) {
                if(data instanceof FormData) {
                    let formData = '';
                    // @ts-ignore
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
            // @ts-ignore
            const search = [...request.requestUri.searchParams];
            if(previous.search) {
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
    },
    reset: (set) => {
        XMLHttpRequest.prototype.open = set.originalOpen;
        XMLHttpRequest.prototype.send = set.originalSend;
        XMLHttpRequest.prototype.setRequestHeader = set.originalsetHeader;
    }
});