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
 * @property {boolean} [filter]
 *
 * @typedef CellOptions
 * @property {string|Object<string,CellOption>|Array<CellOption>|Array<Array<CellOption>>} [data]
 * @property {any} [helperData]
 * @property {(CellOptions)=>void} [onclick]
 * @property {string} [filterKey]
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
                this.filter = options.filter || false;
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
             * @param {(element:CellOptions)=>boolean} [filterFunction]
             */
            addTable(parent, data, level = 0, filterFunction = () => true) {
                const table = document.createElement('table');
                for(let i = 0; i < data.length; i++) {
                    const row = data[i];
                    const rowElement = document.createElement('tr');
                    for(let j = 0; j < row.length; j++) {
                        let element = row[j];
                        if(!filterFunction(element)) {
                            continue;
                        }
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

            addFilter() {
                console.log('adding filter');
                this.filterElement = document.createElement('input');
                this.filterElement.placeholder = 'filter';
                this.filterElement.addEventListener('keyup', () => {
                    this.tableContainer.remove();
                    this.createTable(element => {
                        debugger;
                        if(element.filterKey) {
                            return element.filterKey.includes(this.filterElement.value);
                        }
                        return JSON.stringify(element)
                            .includes(this.filterElement.value);
                    });
                });
                this.tableOptionsContainer.appendChild(this.filterElement);
            }

            /**
             * @returns {HTMLElement}
             */
            createDom() {
                this.tableOptionsContainer = document.createElement('div');

                if(this.filter) {
                    this.addFilter();
                }
                this.createTable();
                this.tableOptionsContainer.style.position = 'absolute';
                this.tableOptionsContainer.style.left = this.tableOptionsContainer.style.right = this.tableOptionsContainer.style.top = this.tableOptionsContainer.style.bottom = '10px';

                //tableContainer.style.backgroundColor = 'white';

                return this.tableOptionsContainer;
            }
            /**
             *
             * @param {(element:CellOptions)=>boolean} [filterFunction]
             */
            createTable(filterFunction) {
                this.tableContainer = document.createElement('div');
                this.addTable(this.tableContainer, this.rows, 0, filterFunction);
                //this.tableContainer.style.overflow = 'auto';
                this.tableOptionsContainer.appendChild(this.tableContainer);
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