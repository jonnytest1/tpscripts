///<reference path="../libs/eval-script.js" />

/**
 * @typedef DOMTable
 * @property {()=>HTMLElement} createDom
 * @property {(parent?:HTMLElement)=>HTMLElement} appendDom
 *
 * @typedef {new (options?:TableConstructorOptions)=>DOMTable} DOMTableCosntructor
 *
 *
 * @typedef TableConstructorOptions
 * @property {TableData} [rows]
 * @property {(cellELement:HTMLTableDataCellElement,cellData:CellOptions,cellIndex:number,rowIndex:number,level:number)=>void} [cellMapper]
 * @property {Partial<CSSStyleDeclaration> } [rowStyle]
 * @property {(rowElement:HTMLElement,index:number,row:Array<CellOptions|string>,level:number)=>void} [rowMapper]
 *
 *
 * @typedef CellOptions
 * @property {string|Object<string,CellOption>|Array<CellOption>|Array<Array<CellOption>>} [data]
 * @property {any} [helperData]
 * @property {(CellOptions)=>void} [onclick]
 *
 *
 * @typedef {CellOptions|string} CellOption
 *
 * @typedef {Array<Array<CellOption|Array<CellOption>>>} TableData
 * @typedef {Array<CellOptions>} TableRowData
 */

new EvalScript('', {
    run: async (resolver, setter) => {

        var tableClass = class Table {

            /**
             *
             * @param {TableConstructorOptions} [options]
             */
            constructor(options = {}) {
                /**
                 * @type {Array<Array<CellOptions>>}
                 */
                this.rows = this.parseRows(options.rows || []);

                this.fillRows();

                this.cellMapper = options.cellMapper;
                this.rowStyle = options.rowStyle || {};
                this.rowMapper = options.rowMapper;
            }
            /**
             *
             * @param {TableData} rows
             * @returns {Array<Array<CellOptions>>}
             */
            parseRows(rows) {
                return rows.map(row => row.map(cell => {
                    if(typeof cell === 'string') {
                        return { data: cell };
                    } else if(cell instanceof Array) {
                        return { data: cell };

                    } else {
                        return cell;
                    }

                }));
            }

            fillRows() {
                let maxCount = Math.max(...this.rows.map(row => row.length));
                for(let row of this.rows) {
                    for(let i = maxCount; i > row.length; i--) {
                        row.push({});
                    }
                }
            }

            /**
             * @param {Array<CellOptions>} rowData
             */
            addRow(rowData) {
                this.rows.push(rowData);
            }

            /**
             *
             * @param {CellOptions} cellData
             * @param {number} rowIndex
             */
            addCell(cellData, rowIndex) {
                if(!this.rows[rowIndex]) {
                    throw 'row not defined with index ' + rowIndex;
                }
                this.rows[rowIndex].push(cellData);
            }

            /**
             *
             * @param {HTMLElement} parent
             * @param {Array<Array<CellOptions>>} data
             */
            addTable(parent, data, level = 0) {
                const table = document.createElement('table');
                for(let i = 0; i < data.length; i++) {
                    const row = data[i];
                    const rowElement = document.createElement('tr');
                    for(let j = 0; j < row.length; j++) {
                        let element = row[j];
                        const cellELement = document.createElement('td');
                        if(element.onclick) {
                            cellELement.onclick = element.onclick;
                        }
                        if(typeof element.data === 'string') {
                            cellELement.textContent = element.data;
                        } else if(element.data instanceof Array) {
                            if(!(element.data[0] instanceof Array)) {
                                // @ts-ignore
                                element.data = element.data.map(el => [el, '']);
                            }
                            // @ts-ignore
                            this.addTable(cellELement, this.parseRows(element.data), level + 1);

                        } else if(element.data) {
                            const innerData = Object.entries(element.data);
                            this.addTable(cellELement, this.parseRows(innerData), level + 1);
                        }
                        if(this.cellMapper) {
                            this.cellMapper(cellELement, element, j, i, level);
                        }
                        rowElement.appendChild(cellELement);

                    }
                    for(let style in this.rowStyle) {
                        rowElement.style[style] = this.rowStyle[style];
                    }
                    if(this.rowMapper) {
                        this.rowMapper(rowElement, i, row, level);

                    }
                    table.appendChild(rowElement);
                    table.style.width = '100%';
                    table.style.height = '100%';
                }
                parent.appendChild(table);
            }

            /**
             * @returns {HTMLElement}
             */
            createDom() {
                const tableContainer = document.createElement('div');
                this.addTable(tableContainer, this.rows);

                tableContainer.style.position = 'absolute';
                tableContainer.style.left = tableContainer.style.right = tableContainer.style.top = tableContainer.style.bottom = '10px';

                //tableContainer.style.backgroundColor = 'white';
                tableContainer.style.overflow = 'auto';
                return tableContainer;
            }
            /**
             *
             * @param {HTMLElement} parnet
             */
            appendDom(parnet = document.body) {
                const table = this.createDom();
                parnet.appendChild(table);
                return table;
            }
        };
        resolver(tableClass);
    }
});