/// <reference path="../customTypes/index.d.ts" />

/**
 * @typedef {{id:string,reason:string}} BlacklistItem
 */

/**
 * @type {{type:EvalScript<{}>}}
 */
var lieferandode = new EvalScript('', {
    waitForResolver: true,
    run: async (resolv, set) => {
        // let [] = await reqS(['asd']);
        /**
         * @type {Array<BlacklistItem>}
         */
        const lieferandoBlacklist = [{ id: '05QO5NORQ', reason: 'trüb' }//  Apfelsaft
        ];

        setInterval(() => {
            const containers = sc.g.eval('div', {
                class: ['meal-container'],
            });

            containers.forEach(contaioner => {
                const blacklistItem = lieferandoBlacklist.find(item => item.id === contaioner.id);
                if(blacklistItem) {
                    contaioner.style.backgroundColor = 'black';
                    contaioner.title = blacklistItem.reason;
                    const child = contaioner.querySelector('div');
                    child.style.backgroundColor = 'black';
                }
            });
            /**
             * @type {NodeListOf<HTMLElement>}
             */
            const orderRows = document.querySelectorAll('#products div.cart-row');
            orderRows.forEach(row => {
                const blacklistItem = lieferandoBlacklist.find(item => item.id === row.id);
                if(blacklistItem) {
                    row.style.backgroundColor = 'red';
                    row.title = blacklistItem.reason;
                }
            });

        }, 1000);

    },
    reset: (set) => {
        //
    }
});