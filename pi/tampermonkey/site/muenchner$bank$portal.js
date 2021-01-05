/// <reference path="../customTypes/index.d.ts" />

/**
 * @typedef {{
 *  amount:number,
 *  text:string,
 *  date:string
 * }} Booking
 */

/**@type {EvalScript<{overview:HTMLElement}>} */
var _ = new EvalScript('', {
    run: async (res, set) => {
        const [chart, _btn] = await reqS(['libs/graphics/googlegraphs', 'DOM/button']);
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
                    '/banking-private/portal?menuId=Postfach',
                    {
                        style:
                            { position: 'absolute', left: 240, top: 300, height: 27, width: 100, backgroundColor: '#50e61c' }
                    });

                /**
                 * @type {Array<HTMLElement>}
                 */
                let elements = sc.g('tblUmsaetze').children[2].children;
                let monatlich = 0;
                let monatlichOptional = 0;
                let essen = 0;
                let rest = 0;
                let gehalt = 0;
                /**
                 * @type { Array<Booking>}
                 */
                const bookings = [];
                for(let obj of elements) {
                    let booking = obj.innerText;
                    const bookingHTML = obj.innerHTML;
                    let amounts = booking.trim()
                        .split('\n')[5]
                        .split('\t');
                    let amount = +amounts[0]
                        .replace('.', '')
                        .replace(',', '.');
                    let numericAmount = amount;
                    const date = obj.children[1].textContent;
                    if(amounts[2].includes('S')) {
                        if(isFood(booking)) {
                            essen += amount;
                            obj.style.backgroundColor = 'orange';
                        } else if(isMonthlyOptional(booking)) {
                            monatlichOptional += amount;
                            obj.style.backgroundColor = '#00c4ff';
                        } else if(isMonthly(booking, bookingHTML)) {
                            monatlich += amount;
                            obj.style.backgroundColor = 'aqua';
                        } else {
                            rest += amount;
                            obj.style.backgroundColor = 'red';
                        }
                        numericAmount = amount * -1;
                    } else if(booking.includes('LOHN/GEHALT')) {
                        gehalt += amount;
                        obj.style.backgroundColor = 'green';
                    }

                    bookings.push({
                        amount: numericAmount,
                        text: booking,
                        date
                    });
                }
                let elementWidth = 130;

                const container = document.createElement('div');
                sc.g('breadcrumb')
                    .appendChild(container);

                crIN(container, '', undefined, undefined, undefined, undefined, {
                    className: 'chart_div',
                    style: {
                        position: 'fixed',
                        right: 20,
                        top: 0
                    }
                });

                set.overview = container;

                createDisplayButtons(container, monatlich, elementWidth, essen, rest, gehalt, monatlichOptional);
                createVisualization(bookings);
            }
        }

        /**
         * @param {string} booking
         * @returns {boolean}
         */
        function isFood(booking) {
            return booking.includes('E-CENTER SCHULER')
                || booking.includes('MCDONALDS')
                || booking.includes('MARKTKAUF/NUERNBERG/DE')
                || booking.includes('TAKEAWAYCOM');
        }

        /**
         * @param {string} booking
         * @param {string} html
         * @returns {boolean}
         */
        function isMonthly(booking, html) {
            console.log(booking);
            return booking.includes('VERKEHRS AG')
                || booking.includes('DB AUTOMAT')
                || booking.includes('Miete')
                || booking.includes('GAA-AUSZAHLUNG')
                || html.includes('Bausparkasse Schwaebisch')
                || html.includes('1u1 Telecom GmbH');
        }
        /**
         * @param {string} booking
         * @returns {boolean}
         */
        function isMonthlyOptional(booking) {
            console.log(booking);
            return booking.includes('CRUNCHYROLL')
                || booking.includes('NETFLIX.COM')
                || booking.includes('AMZNPri');

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
            crIN(container, 'monat: ' + monatlich.toPrecision(4), undefined, undefined, undefined, undefined, {
                style: {
                    position: 'fixed',
                    left: 0,
                    width: elementWidth,
                    top: 0,
                    backgroundColor: 'aqua'
                }
            });
            crIN(container, 'optMonth: ' + monatlichOptional, undefined, undefined, undefined, undefined, {
                style: {
                    position: 'fixed',
                    left: elementWidth,
                    width: elementWidth,
                    top: 0,
                    backgroundColor: '#00c4ff'
                }
            });
            crIN(container, 'essen: ' + Math.round(essen * 100) / 100, undefined, undefined, undefined, undefined, {
                style: {
                    position: 'fixed',
                    left: 2 * elementWidth,
                    width: elementWidth,
                    top: 0,
                    backgroundColor: 'orange',
                }
            });
            crIN(container, 'rest: ' + Math.round(rest), undefined, undefined, undefined, undefined, {
                style: { position: 'fixed', left: 3 * elementWidth, width: elementWidth, top: 0, backgroundColor: 'red' }
            });
            let ges = (rest + essen + monatlich + monatlichOptional);
            let gesamt = crIN(container, 'gesamt: ' + Math.round(ges), undefined, undefined, undefined, undefined, {
                style: { position: 'fixed', left: 4 * elementWidth, width: elementWidth, top: 0 }
            });
            crIN(container, 'gehalt: ' + gehalt, undefined, undefined, undefined, undefined, {
                style: { position: 'fixed', left: 0, width: elementWidth, top: 23, backgroundColor: 'green' }
            });
            crIN(container, 'gehalt: ' + gehalt, undefined, undefined, undefined, undefined, {
                style: { position: 'fixed', left: 4 * elementWidth, width: elementWidth, top: 23, backgroundColor: 'green' }
            });
            let differenz = crIN(container, 'diff: ' + Math.round(gehalt - ges), undefined, undefined, undefined, undefined,
                { style: { position: 'fixed', left: 4 * elementWidth, top: 46, width: elementWidth } });
            if(gehalt < ges) {
                gesamt.style.backgroundColor = 'orange';
                differenz.style.backgroundColor = 'red';
            }
            else {
                gesamt.style.backgroundColor = 'green';
                differenz.style.backgroundColor = 'green';
            }
        }
        /**
         *
         * @param {Array<Booking>} bookings
         */
        function createVisualization(bookings) {
            var data = new chart.google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'Amount');
            data.addColumn({
                type: 'string',
                role: 'tooltip',
            });

            const startAmountElement = document.querySelector('div[id*=StartsaldoValue]');
            const startAmount = startAmountElement.textContent.trim();
            const startAMountReplaced = startAmount.split(' ')[0]
                .replace(/\./g, '')
                .replace(',', '.');
            let currentAmount = +startAMountReplaced;

            const firstBooking = bookings[bookings.length - 1];
            data.addRow([bookingToDate(firstBooking), currentAmount, 'initial']);

            bookings
                .reverse()
                .forEach(booking => {
                    currentAmount += booking.amount;
                    data.addRow([bookingToDate(booking), currentAmount, `${currentAmount.toPrecision(6)}\n${booking.text}`]);
                });
            // Set chart options
            var options = {
                'title': 'Umsätze',
                'width': 400,
                'height': 300
            };
            var cChart = new chart.google.visualization.ComboChart(document.querySelector('.chart_div'));
            cChart.draw(data, options);
        }

        /**
         *
         * @param {Booking} booking
         */
        function bookingToDate(booking) {
            const dateStr = booking.date
                .split('.')
                .reverse()
                .join('.');
            return new Date(dateStr);
        }
    },
    reset: (set) => {
        set.overview.remove();

    }
});
