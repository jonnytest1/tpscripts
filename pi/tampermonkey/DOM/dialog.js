
/**
 *
 *
 * @typedef {new (options?:DialogConstructor)=>Dialog} DOMDialogConstructor
 * @typedef DialogConstructor
 * @property {HTMLElement} [parent]
 * @property {Array<DialogContent>} [contents]
 * @property {boolean} [addControls]
 * @property {Array<ControlElement>} [customControls]
 *
 *
 * @typedef {HTMLElement|{title:string,callback:()=>any,controlKey?:string}} ControlElement
 *

 *
 * @typedef Dialog
 * @property {()=>DialogContent} back
 * @property {(content:DialogContent|HTMLElement)=>void} addContent
 * @property {(content:DialogContent|HTMLElement|string)=>void} setContent
 * @property {(control:ControlElement) => void} addControl
 * @property {()=>void} reset
 * @property {()=>void} remove
 *
 * @typedef DialogContent
 * @property {HTMLElement} content
 * @property {string} [title]
 */
/**
 * @type {EvalScript<DOMDialogConstructor>}
 */
var dialogScript = new EvalScript('', {
    run: async (resolver, ) => {

        var dialogClass = class Dialog {

            /**
             *
             * @param {DialogConstructor} options
             */
            constructor(options = {}) {
                this.parent = options.parent || document.body;
                this.addControls = options.addControls || false;
                this.customControls = options.customControls || [];
                /**
                 * @type {Array<DialogContent>}
                 */
                this.contents = [];
                if(options.contents) {
                    this.contents = options.contents;
                }

                this.contentIndex = 0;

                document.addEventListener('keydown', event => {
                    if(event.keyCode === 27 && this.overlay) {
                        this.remove();
                    }
                });

                this.reset();
            }
            /**
             *
             * @param {*} obj
             * @returns {HTMLElement}
            */
            htmlify(obj) {
                if(!(obj instanceof HTMLElement)) {
                    const temp = obj;
                    obj = document.createElement('td');
                    obj.textContent = temp.title;
                    obj.onclick = temp.callback;
                }
                return obj;
            }

            /**
             *
             * @param {ControlElement} control
             */
            addControl(control) {
                this.customControls.push(control);

                this.reset();

            }

            reset() {

                if(this.controlsElement) {
                    this.controlsElement.remove();
                }
                if(this.overlay) {
                    this.overlay.remove();
                }

                this.overlay = document.createElement('div');
                this.parent.appendChild(this.overlay);

                this.overlay.style.position = 'fixed';
                this.overlay.style.left = this.overlay.style.right = this.overlay.style.top = this.overlay.style.bottom = '20px';
                this.overlay.style.zIndex = '999999999';
                this.overlay.style.backgroundColor = 'white';

                if(this.contents && this.contents.every(content => content.title) && this.contents.length > 0) {
                    this.setTabBar();
                }

                this.dialogContent = document.createElement('div');
                this.overlay.appendChild(this.dialogContent);
                this.dialogContent.style.position = 'absolute';
                this.dialogContent.style.bottom = this.dialogContent.style.left = this.dialogContent.style.right = this.dialogContent.style.top = '0px';
                this.dialogContent.style.overflow = 'auto';

                if(this.addControls || this.customControls.length > 0) {
                    this.dialogContent.style.bottom = '40px';
                    this.controlsElement = document.createElement('table');
                    this.overlay.appendChild(this.controlsElement);

                    //  this.controlsElement.textContent = 'controls';
                    this.controlsElement.style.position = 'absolute';
                    this.controlsElement.style.bottom = this.controlsElement.style.left = this.controlsElement.style.right = '0px';
                    this.controlsElement.style.height = '40px';

                    this.setControls();

                }

                this.setInner();
            }

            setControls() {

                const controlRow = document.createElement('tr');

                if(this.addControls) {
                    const next = document.createElement('td');
                    next.textContent = 'next';
                    next.style.verticalAlign = 'middle';
                    next.style.textAlign = 'center';
                    next.onclick = () => this.forward();
                    controlRow.appendChild(next);

                    const back = document.createElement('td');
                    back.textContent = 'back';
                    back.style.verticalAlign = 'middle';
                    back.style.textAlign = 'center';
                    back.onclick = () => this.back();
                    controlRow.appendChild(back);

                }
                this.customControls.forEach(controlElement => {
                    if(!(controlElement instanceof HTMLElement)) {
                        if(controlElement.controlKey
                            && this.contents[this.contentIndex]
                            && this.contents[this.contentIndex].title !== controlElement.controlKey) {
                            return;
                        }
                    }

                    controlElement = this.htmlify(controlElement);
                    if(controlElement.tagName !== 'TD') {
                        const tempElement = controlElement;
                        controlElement = document.createElement('td');
                        controlElement.appendChild(tempElement);
                    }
                    controlElement.style.verticalAlign = 'middle';
                    controlElement.style.textAlign = 'center';
                    controlRow.appendChild(controlElement);
                });

                this.controlsElement.appendChild(controlRow);
            }

            setTabBar() {
                this.tabbar = document.createElement('table');

                this.tabbar.style.width = '100%';
                this.tabbar.style.height = '50px';
                this.tabbar.style.backgroundColor = 'white';

                const tr = document.createElement('tr');
                this.tabbar.appendChild(tr);
                for(let content of this.contents) {
                    const tabitem = document.createElement('td');
                    tabitem.textContent = content.title;
                    tabitem.onclick = () => {
                        this.setContent(content.title);
                    };
                    tabitem.style.border = '1px solid black';
                    tabitem.style.textAlign = 'center';
                    tr.appendChild(tabitem);

                }
                this.overlay.appendChild(this.tabbar);
            }

            /**
             * @param {DialogContent|HTMLElement|string} contentObj
             */
            setContent(contentObj) {
                if(typeof contentObj === 'string') {
                    this.contentIndex = this.contents.findIndex(content => content.title === contentObj);
                } else if(contentObj instanceof HTMLElement) {
                    this.contentIndex = this.contents.findIndex(content => content.content === contentObj);
                } else {
                    this.contentIndex = this.contents.indexOf(contentObj);
                }
                this.setInner();
            }

            setInner() {
                this.current = this.contents[this.contentIndex];
                for(let i = this.dialogContent.children.length - 1; i >= 0; i--) {
                    this.dialogContent.children[i].remove();
                }
                if(this.current) {
                    this.dialogContent.appendChild(this.current.content);
                } else {
                    console.warn('no dialog set');
                }

            }

            /**
             *
             * @param {number} index
             */
            setIndex(index) {
                this.contentIndex = index;
                this.reset();
            }

            /**
             * @param {DialogContent|HTMLElement} content
             */
            addContent(content) {
                if(content instanceof HTMLElement) {
                    content = { content: content };
                }

                this.contentIndex = this.contents.push(content) - 1;
                this.setIndex(this.contentIndex);
            }

            back() {
                this.contentIndex--;
                if(this.contentIndex < 0) {
                    this.contentIndex = 0;
                }
                this.reset();
            }

            forward() {
                this.contentIndex++;
                this.reset();
            }

            remove() {
                if(this.overlay) {
                    this.overlay.remove();
                    this.overlay = undefined;
                }
            }
        };
        resolver(dialogClass);
    }
});