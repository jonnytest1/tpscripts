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
                let essen = 0;
                let rest = 0;
                let gehalt = 0;
                for(let obj of elements) {
                    let booking = obj.innerText;
                    let amounts = booking.trim()
                        .split('\n')[5]
                        .split('\t');
                    let amount = +amounts[0]
                        .replace('.', '')
                        .replace(',', '.');
                    if(amounts[2].includes('S')) {
                        if(booking.includes('E-CENTER SCHULER')) {
                            essen += amount;
                            obj.style.backgroundColor = 'orange';
                        }
                        else if(booking.includes('VERKEHRS AG')) {
                            monatlich += amount;
                            obj.style.backgroundColor = 'aqua';
                        }
                        else if(booking.includes('Miete')) {
                            monatlich += amount;
                            obj.style.backgroundColor = 'aqua';
                        }
                        else if(booking.includes('GAA-AUSZAHLUNG')) {
                            monatlich += amount;
                            obj.style.backgroundColor = 'aqua';
                        }
                        else {
                            rest += amount;
                            obj.style.backgroundColor = 'red';
                        }
                    }
                    else if(booking.includes('LOHN/GEHALT')) {
                        gehalt += amount;
                        obj.style.backgroundColor = 'green';
                    }
                }
                let elementWidth = 130;
                let cssWidth = elementWidth + 'px';
                let sndWidth = 2 * elementWidth + 'px';
                let trdWidth = 3 * elementWidth + 'px';

                const container = document.createElement('div');
                sc.g('breadcrumb')
                    .appendChild(container);
                set.overview = container;

                createDisplayButtons(container, monatlich, cssWidth, essen, rest, sndWidth, trdWidth, gehalt);
            }
        }

        function createDisplayButtons(container, monatlich, cssWidth, essen, rest, sndWidth, trdWidth, gehalt) {
            crIN(container, 'monat: ' + monatlich, undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: '0px', width: cssWidth, top: '0px' } });
            crIN(container, 'essen: ' + Math.round(essen * 100) / 100, undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: cssWidth, width: cssWidth, top: '0px' } });
            crIN(container, 'rest: ' + Math.round(rest), undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: sndWidth, width: cssWidth, top: '0px' } });
            let ges = (rest + essen + monatlich);
            let gesamt = crIN(container, 'gesamt: ' + Math.round(ges), undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: trdWidth, width: cssWidth, top: '0px' } });
            crIN(container, 'gehalt: ' + gehalt, undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: '0px', width: cssWidth, top: '23px', backgroundColor: 'green' } });
            crIN(container, 'gehalt: ' + gehalt, undefined, undefined, undefined, undefined, { style: { position: 'fixed', left: trdWidth, width: cssWidth, top: '23px', backgroundColor: 'green' } });
            let differenz = crIN(container, 'diff: ' + Math.round(gehalt - ges), undefined, undefined, undefined, undefined,
                { style: { position: 'fixed', left: trdWidth, top: '46px', width: cssWidth } });
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
