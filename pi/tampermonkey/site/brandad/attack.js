/// <reference path="../../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var attack = new EvalScript('', {
    run: async (resolv, set) => {
        /**
        *
        * @param {RequestStorage} request
        * @returns {Promise<Array<{request:string,response:string}>>}
        */
        async function bruteForce(request) {
            const url = new URL(request.url);

            const requestUrl = `${url.origin}${url.pathname}`;

            const methods = ['GET', 'POST', 'PUT', 'DELETE'];

            const errorStrings = ['%2F___', '', '%3Cscript%3Ealert%28%22XSS%22%29%3C%2Fscript%3E'];

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
        resolv(bruteForce);
    },
    reset: (set) => {
        //
    }
});