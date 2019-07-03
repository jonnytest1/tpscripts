///<reference path="../customTypes/index.d.ts"/>
new EvalScript('', {
    /**
     * @typedef {HTMLElement &{
     *  message:any
     * }} chatElement
     */

    run: async (res, set) => {
        set.interval = setInterval(() => {
            const messages = document.querySelectorAll('.message');
            messages.forEach(message => {
                /**@type {chatElement} */
                const body = message.querySelector('.body');
                if(!body.message) {
                    try {
                        body.message = JSON.parse(body.textContent);
                    } catch(jsonError) {
                        return;
                    }
                    /**@type string */
                    let logMessage = body.message.message;
                    if(logMessage.length > 100) {
                        logMessage = logMessage.substr(0, 100);
                    }
                    body.innerHTML = logMessage + '<br><button>HIDDEN ->COPY to KIbana</button>';
                    /**@param { MouseEvent & {target:{parentElement:chatElement}}} e */
                    body.querySelector('button').onclick = (e) => {
                        const button = e.target;
                        const parent = button.parentElement;

                        GM_xmlhttpRequest({
                            method: 'PUT',
                            url: 'http://192.168.178.48/logging',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify(parent.message),
                            onerror: console.log,
                            onabort: error => {
                                debugger;
                            },
                            onload: (event) => { return; }
                        });
                    };
                }
            });
        }, 2000);

    },
    reset: (set) => {
        clearInterval(set.interval);
    }
});