// tslint:disable: no-invalid-this

const openMethod = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(...args) {
    this['requestUrl'] = args[1];
    console.log(args[1]);
    return openMethod.call(this, ...args);
};

const send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(...args) {

    if(args[0] && args[0]) {
        this.onreadystatechange = function(e) {
            if(this.readyState === 4) {
                const response = this.response;
                Object.defineProperty(this, 'response', {
                    get: () => {
                        return response;
                    }
                });
                //debugger;
            }
        };
    }
    send.call(this, ...args);
};

const fetchMethod = fetch;
window.fetch = function(...args) {
    return fetchMethod.call(this, ...args)
        .then(responseObj => {
            const prevJson = responseObj.json;

            responseObj.json = function() {
                if(this.url.includes('bulk')) {
                    return prevJson.call(this)
                        .then(json => {
                            // change json;
                            return json;
                        });
                }
                return prevJson.call(this);
            };

            return responseObj;
        });
};
