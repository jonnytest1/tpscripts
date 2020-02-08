
/**
 *
 *
 * @typedef {new (options?:DialogConstructor)=>Dialog} DOMDialogConstructor
 * @typedef DialogConstructor
 * @property {HTMLElement} [parent]
 * @property {Array<DialogContent>} [contents]
 *
 *
 *
 * @typedef Dialog
 * @property {()=>DialogContent} back
 * @property {(content:DialogContent|HTMLElement)=>void} addContent
 * @property {(content:DialogContent|HTMLElement|string)=>void} setContent
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

            reset() {

                this.overlay = document.createElement('div');

                this.overlay.style.position = 'fixed';
                this.overlay.style.left = this.overlay.style.right = this.overlay.style.top = this.overlay.style.bottom = '20px';
                this.overlay.style.zIndex = '999999999';
                this.overlay.style.backgroundColor = 'white';
                // this.overlay.style.overflow = 'scroll';

                this.parent.appendChild(this.overlay);

                this.setInner();
            }

            setTabBar() {
                const tabbar = document.createElement('table');

                tabbar.style.width = '100%';
                tabbar.style.height = '50px';
                tabbar.style.backgroundColor = 'white';

                const tr = document.createElement('tr');
                tabbar.appendChild(tr);
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
                this.overlay.appendChild(tabbar);
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
                for(let i = this.overlay.children.length - 1; i >= 0; i--) {
                    this.overlay.children[i].remove();
                }
                if(this.contents.every(content => content.title) && this.contents.length > 0) {
                    this.setTabBar();
                }
                if(this.contents[this.contentIndex]) {
                    this.overlay.appendChild(this.contents[this.contentIndex].content);
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
                this.setInner();
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
                this.setInner();
            }

            forward() {
                this.contentIndex++;
                this.setInner();
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