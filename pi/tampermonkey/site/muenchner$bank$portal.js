/// <reference path="../customTypes/index.d.ts" />

/**@type {EvalScript<{overview:HTMLElement}>} */
var _ = new EvalScript('', {
    run: async (res, set) => {
        await reqS('DOM/button');

        if(sc.g('stackedFrontletTitle') && sc.g('stackedFrontletTitle').innerText === 'Umsatzanzeige' && querydoc('#lblUmsaetzeVonValue')) {

            const vonField = querydoc('#lblUmsaetzeVonValue');

            const bisField = querydoc('#lblUmsaetzeBisValue');
            let vonDate = +new Date(vonField.innerText
                .split('.')
                .reverse()
                .join('.'));
            let toDate = +new Date(bisField.innerText
                .split('.')
                .reverse()
                .join('.'));
            if((toDate - vonDate) / (1000 * 60 * 60 * 24) > 10) {
                crIN(
                    sc.g('cntSalden'),
                    'archiv',
                    undefined,
                    undefined,
                    undefined,
                    'https://www.muenchner-bank.de/banking-private/portal?menuId=Postfach',
                    { style: { position: 'absolute', left: '240px', top: '300px', height: '27px', width: '100px', backgroundColor: '#50e61c' } });

                /**
                 * @type {Array<HTMLElement>}
                 */
                let elements = sc.g('tblUmsaetze').children[2].children;
                let monatlich = 0;
                let monatlichOptional = 0;
                let essen = 0;
                let rest = 0;
                let gehalt = 0;
                for(let obj of elements) {
                    let booking = obj.innerText;
                    const bookingHTML = obj.innerHTML;
                    let amounts = booking.trim()
                        .split('\n')[5]
                        .split('\t');
                    let amount = +amounts[0]
                        .replace('.', '')
                        .replace(',', '.');
                    if(amounts[2].includes('S')) {
                        if(isFood(booking)) {
                            essen += amount;
                            obj.style.backgroundColor = 'orange';
                        } else if(isMonthly(booking, bookingHTML)) {
                            monatlich += amount;
                            obj.style.backgroundColor = 'aqua';
                        } else if(isMonthlyOptional(booking)) {
                            monatlichOptional += amount;
                            obj.style.backgroundColor = '#00c4ff';
                        } else {
                            rest += amount;
                            obj.style.backgroundColor = 'red';
                        }
                    } else if(booking.includes('LOHN/GEHALT')) {
                        gehalt += amount;
                        obj.style.backgroundColor = 'green';
                    }
                }
                let elementWidth = 130;

                const container = document.createElement('div');
                sc.g('breadcrumb')
                    .appendChild(container);
                set.overview = container;

                createDisplayButtons(container, monatlich, elementWidth, essen, rest, gehalt, monatlichOptional);
            }
        }

        /**
         * @param {string} booking
         * @returns {boolean}
         */
        function isFood(booking) {
            return booking.includes('E-CENTER SCHULER') ||
                booking.includes('MCDONALDS') ||
                booking.includes('MARKTKAUF/NUERNBERG/DE') ||
                booking.includes('TAKEAWAYCOM');
        }

        /**
         * @param {string} booking
         * @param {string} html
         * @returns {boolean}
         */
        function isMonthly(booking, html) {
            console.log(booking);
            return booking.includes('VERKEHRS AG') ||
                booking.includes('DB AUTOMAT') ||
                booking.includes('Miete') ||
                booking.includes('GAA-AUSZAHLUNG') || html.includes('1u1 Telecom GmbH');
        }
        /**
         * @param {string} booking
         * @returns {boolean}
         */
        function isMonthlyOptional(booking) {
            console.log(booking);
            return booking.includes('CRUNCHYROLL');
        }
        /**
         *
         * @param {HTMLElement} container
         * @param {number} monatlich
         * @param {number} elementWidth
         * @param {number} essen
         * @param {number} rest
         * @param {number} gehalt
         * @param {number} monatlichOptional
         */
        function createDisplayButtons(container, monatlich, elementWidth, essen, rest, gehalt, monatlichOptional) {
            crIN(container, 'monat: ' + monatlich, undefined, undefined, undefined, undefined, {
                style: {
                    position: 'fixed',
                    left: '0px',
                    width: elementWidth,
                    top: '0px',
                    backgroundColor: 'aqua'
                }
            });
            crIN(container, 'optMonth: ' + monatlichOptional, undefined, undefined, undefined, undefined, {
                style: {
                    position: 'fixed',
                    left: elementWidth,
                    width: elementWidth,
                    top: '0px',
                    backgroundColor: '#00c4ff'
                }
            });
            crIN(container, 'essen: ' + Math.round(essen * 100) / 100, undefined, undefined, undefined, undefined, {
                style: {
                    position: 'fixed',
                    left: 2 * elementWidth,
                    width: elementWidth,
                    top: '0px',
                    backgroundColor: 'orange',
                }
            });
            crIN(container, 'rest: ' + Math.round(rest), undefined, undefined, undefined, undefined, {
                style: { position: 'fixed', left: 3 * elementWidth, width: elementWidth, top: '0px', backgroundColor: 'red' }
            });
            let ges = (rest + essen + monatlich + monatlichOptional);
            let gesamt = crIN(container, 'gesamt: ' + Math.round(ges), undefined, undefined, undefined, undefined, {
                style: { position: 'fixed', left: 4 * elementWidth, width: elementWidth, top: '0px' }
            });
            crIN(container, 'gehalt: ' + gehalt, undefined, undefined, undefined, undefined, {
                style: { position: 'fixed', left: '0px', width: elementWidth, top: '23px', backgroundColor: 'green' }
            });
            crIN(container, 'gehalt: ' + gehalt, undefined, undefined, undefined, undefined, {
                style: { position: 'fixed', left: 4 * elementWidth, width: elementWidth, top: '23px', backgroundColor: 'green' }
            });
            let differenz = crIN(container, 'diff: ' + Math.round(gehalt - ges), undefined, undefined, undefined, undefined,
                { style: { position: 'fixed', left: 4 * elementWidth, top: '46px', width: elementWidth } });
            if(gehalt < ges) {
                gesamt.style.backgroundColor = 'orange';
                differenz.style.backgroundColor = 'red';
            }
            else {
                gesamt.style.backgroundColor = 'green';
                differenz.style.backgroundColor = 'green';
            }
        }
    },
    reset: (set) => {
        set.overview.remove();
    }
});
