
async function getLogs() {

    const response = await fetch('logs.php');
    /**
     * @typedef LogElement
     * @property {string} application
     * @property {"ERROR"|"DEBUG"|"INFO"} severity
     * @property {string} timestamp
     * @property {string} message
     */
    /**
    * @type {Array<LogElement>}
    */
    const logs = await response.json();
    /**
     * @type { HTMLTableElement}
     */
    const table = document.querySelector('.center');

    let newCount = 0;
    if(location.search.includes('count=')) {
        newCount = +location.search.split('count=')[1]
            .split('&')[0];
    }

    let count = 0;
    let errorCount = 0;

    appendRows(table, logs, (el, tr) => {
        tr.addEl(new Date(el.timestamp + 'Z').toLocaleString()
            .replace(', ', '\n'));
        tr.addEl(el.application);
        tr.addEl(el.severity);
        tr.addEl(el.message.length > 1000 ? el.message.substr(0, 1000) : el.message);

        if(count % 2 === 0) {
            tr.style.backgroundColor = '#adff2fa3';
        }
        if(el.severity === 'ERROR' && errorCount < newCount) {
            debugger;
            errorCount++;
            tr.style.backgroundColor = '#e0aa7cb8';
        }
        count++;
        let enabled = false;
        let attributesTable;
        tr.addEventListener('click', () => {
            if(!enabled) {
                attributesTable = document.createElement('table');
                attributesTable.style.border = '1px solid black';
                const remainingAtts = [];

                for(let key in el) {
                    if(key !== 'application' && key !== 'severity' && (key !== 'message' || el[key].length > 1000) && key !== 'timestamp') {
                        remainingAtts.push({ key, value: el[key] });
                    }
                }
                appendRows(attributesTable, remainingAtts, (atts, attRow) => {
                    attRow.addEl(atts.key);
                    attRow.addEl(atts.value);
                });
                tr.after(attributesTable);
            } else {
                attributesTable.remove();
            }
            enabled = !enabled;
        });
    });
}

/**
 * @template T
 *
 * @param {HTMLTableElement} table
 * @param {Array<T>} array
 * @param {(el:T,td:HTMLTableRowElement & {addEl:(text:String)=>void})=>void} fnc
 */
function appendRows(table, array, fnc) {
    array.forEach(el => {
        /**
         * @type {HTMLTableRowElement & {addEl:(text:String)=>void}}
         */
        // @ts-ignore
        const tr = document.createElement('tr');
        tr.addEl = (text) => {
            text = `${text}`;
            const td = document.createElement('td');
            const textParts = text.split('\n');
            textParts.forEach((subText, i) => {
                const textEl = document.createElement('span');
                textEl.textContent = subText;
                td.appendChild(textEl);
                textEl.style.whiteSpace = 'nowrap';
                textEl.style.textAlign = 'center';
                if(i < textParts.length - 1) {
                    const br = document.createElement('br');
                    td.appendChild(br);
                } else {
                    textEl.style.display = 'block';
                }
            });
            tr.appendChild(td);
        };
        fnc(el, tr);
        table.appendChild(tr);
    });
}

getLogs();