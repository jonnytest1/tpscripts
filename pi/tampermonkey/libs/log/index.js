/// <reference path="./logging.js"/>
let startIndex = 0;

async function loadMore() {
    await getLogs();
}

async function getLogs() {

    const response = await fetch('logs.php', {
        headers: {
            'start-index': `${startIndex}`
        }
    });
    /**
     * @typedef LogElement
     * @property {string} application
     * @property {LogLevel} severity
     * @property {string} timestamp
     * @property {string} message
     * @property {number} id
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
    startIndex += logs.length;
    let count = 0;
    let errorCount = 0;
    logs.sort((log1, log2) => {
        const log2Millis = new Date(log2.timestamp + 'Z').valueOf();
        const log1Millis = new Date(log1.timestamp + 'Z').valueOf();
        if(log2Millis === log1Millis) {
            return log2.id - log1.id;
        }
        return log2Millis - log1Millis;
    });
    appendRows(table, logs, (el, tr) => {
        tr.addEl(new Date(el.timestamp + 'Z').toLocaleString()
            .replace(', ', '\n')).style.width = '3%';
        tr.addEl(el.application).style.width = '5%';
        const td = tr.addEl(el.severity);
        td.style.width = '5%';
        if(el.severity === 'ERROR') {
            td.style.backgroundColor = '#f9531ae6';
        }
        if(el.severity === 'WARN') {
            td.style.backgroundColor = '#f9911ae6';
        }
        const messageTd = tr.addEl(el.message.length > 1000 ? el.message.substr(0, 1000) : el.message);
        messageTd.style.width = '80%';
        messageTd.style.overflow = 'hidden';
        if(count % 2 === 0) {
            tr.style.backgroundColor = '#adff2fa3';
        }
        if(el.severity === 'ERROR' && errorCount < newCount) {
            errorCount++;
            tr.style.backgroundColor = '#f9531ae6';
        }
        count++;
        let enabled = false;
        let attributesTable;
        tr.addEventListener('click', () => {
            const selection = window.getSelection();
            for(let i = 0; i < selection.rangeCount; i++) {
                const range = selection.getRangeAt(i);
                if(range.startContainer !== range.endContainer || range.startOffset !== range.endOffset) {
                    return;
                }
            }
            if(!enabled) {

                const tableTr = document.createElement('tr');
                const tableTd = document.createElement('td');
                tableTd.colSpan = 4;

                attributesTable = document.createElement('table');
                attributesTable.style.border = '1px solid black';
                attributesTable.style.width = '100%';
                attributesTable.style.tableLayout = 'fixed';
                const remainingAtts = [];

                for(let key in el) {
                    if(key !== 'application' && key !== 'severity' && (key !== 'message' || el[key].length > 1000) && key !== 'timestamp') {
                        remainingAtts.push({ key, value: el[key] });
                    }
                }
                appendRows(attributesTable, remainingAtts, (atts, attRow) => {
                    attRow.addEl(atts.key).style.width = '5%';
                    const value = attRow.addEl(atts.value);
                    value.style.borderLeft = '1px solid black';
                    value.querySelectorAll('span')
                        .forEach(span => {
                            span.style.whiteSpace = 'initial';
                            span.style.wordBreak = 'break-word';
                        });
                    value.style.width = '80%';
                    value.style.textAlign = 'center';
                    value.style.overflow = 'hidden';
                });
                tableTd.appendChild(attributesTable);
                tableTr.appendChild(tableTd);
                tr.after(tableTr);
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
 * @param {(el:T,td:HTMLTableRowElement & {addEl:(text:String)=>HTMLTableDataCellElement})=>void} fnc
 */
function appendRows(table, array, fnc) {
    array.forEach(el => {
        /**
         * @type {HTMLTableRowElement & {addEl:(text:String)=>HTMLTableDataCellElement}}
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
            //td.style.border = '1px solid #ccc';
            return td;
        };
        fnc(el, tr);
        table.appendChild(tr);
    });
}

getLogs();