class Menu {
    /**
     * @typedef RectMenuElement
     * @property {String} name
     * @property {Array<RectMenuElement>} [children]
     * @property {Function} [click]
     * @property {boolean} [enabled]
     * @property {(btn:MenuHTMLElement,menu:RectMenuElement)=>void} [buttonCustomizer]
     * 
     *
     * @typedef { HTMLElement &{
     *   menu? :RectMenuElement ,
     *   left?:number,
     *   bottom?:number
     *   zIndex?:number
     * }} MenuHTMLElement
     *
     * 
     * 
     * @typedef {RectMenuElement & {
     *       width:number
     * }} RectControlElement
     *  
     * 
     * 
     * @typedef RectConstructorOptions
     * @property {HTMLElement} [parent]
     * @property {RectControlElement} [control]
     * 
     * 
     * @param { RectConstructorOptions } options 
     */
    constructor(options) {
        this.parent = options.parent || document.body
        this.offset = options.control ? options.control.width : 0

        this.control = options.control
        /**@type {Array<RectMenuElement>} */
        this.elements = [];
        this.addMainContainer();
        this.draw();
    }

    addMainContainer() {
        this.container = crIN(this.parent, "", undefined, undefined, undefined, undefined, {
            style: {
                bottom: "0px",
                backgroundColor: "gray",
                left: "0px",
                right: "0px",
                height: "26px"
            }
        });
    }

    /**
     * @param {RectMenuElement|Array<RectMenuElement>} menu
     * 
     */
    addToMenu(menu) {
        if (menu instanceof Array) {
            for (let m of menu) {
                this.addToMenu(m);
            }
        } else {
            this.elements.push(menu);
            this.draw();
        }

    }

    remove(parent) {
        let children = parent.menu.children;
        if (children) {
            for (let i = parent.children.length - 1; i >= 0; i--) {
                let element = parent.children[i];
                if (element.tagName == "tampermonkey-button".toUpperCase()) {
                    element.remove();
                }
            }
        }
    }

    /**
     * 
     * @param {MenuHTMLElement} parent 
     * 
     */
    setVisible(parent, horizontal = false) {

        function getColor() {
            let abc = Math.floor(Math.random() * 3);
            let col = new Array(3);
            col[abc] = 230;
            abc += 1 + Math.floor(Math.random() * 2);
            if (abc >= col.length) {
                abc -= col.length;
            }
            col[abc] = Math.random() * 255;
            for (let i = 0; i < col.length; i++) {
                if (col[i] === undefined) {
                    col[i] = 255 - col[abc];
                }
            }
            return "rgb(" + Math.floor(col[0]) + ", " + Math.floor(col[1]) + ", " + Math.floor(col[2]) + ")";
        }


        let children = parent.menu.children;
        if (children) {
            let color = getColor();
            let top = 1;
            let width = Math.min(+parent.style.width.replace("px", ""), window.innerWidth / 4);
            let left = 0;
            let right;
            let fixLeft;
            if (horizontal) {
                top--;
                left = +parent.style.width.replace("px", "");
                if (parent.left + width > window.innerWidth) {
                    left = 0;
                    right = "0px";
                }

                fixLeft = parent.left + (right ? -width / 2 : parent.offsetWidth + (width / 2));

            }
            for (let element of children) {
                let currentBottom = (top++ * 23);
                /** @type {MenuHTMLElement} */
                let btn = crIN(parent, element.name, element.click,
                    /** @param {MenuHTMLElement} btn */
                    (btn) => this.setVisible(btn, true),
                    /** @param {MenuHTMLElement} btn */
                    (btn) => this.remove(btn), undefined, {
                        style: {
                            left: !right ? left + "px" : undefined,
                            right: right ? width + "px" : undefined,
                            bottom: currentBottom + "px",
                            position: "absolute",
                            width: width + "px",
                            border: "1px solid black",
                            backgroundColor: color
                        }
                    })
                if (fixLeft) {
                    let behind = document.elementFromPoint(fixLeft, window.innerHeight - (parent.bottom + currentBottom))
                    if (behind != btn && behind.parentElement !== btn) {
                        behind.parentElement.style.zIndex = "20000";
                    }
                }
                btn.menu = element;
                btn.left = parent.left + left;
                btn.bottom = parent.bottom + currentBottom;
                btn.zIndex = parent.zIndex + 200

                if (element.buttonCustomizer) {
                    element.buttonCustomizer(btn, element);
                }
            }
        }
    }

    draw() {
        for (let el of this.container.children) {
            el.remove();
        }
        let width = ((window.innerWidth - this.offset) / (this.elements.length)) - 4;
        let mainIndex = 0;
        for (let element of this.elements) {
            let left = this.offset + (mainIndex++ * width);
            /** @type {MenuHTMLElement} */
            const menuBtn = crIN(this.container, element.name, element.click,

                /** @param {MenuHTMLElement} btn */
                (btn) => this.setVisible(btn),
                /** @param {MenuHTMLElement} btn */
                (btn) => this.remove(btn)
                , undefined, {
                    style: {
                        left: left + "px",
                        width: width + "px",
                        border: "1px solid black",
                        zIndex: 200000
                    }
                })
            menuBtn.menu = element;
            menuBtn.left = left;
            menuBtn.zIndex = 200000;
            menuBtn.bottom = 20;

            if (element.buttonCustomizer) {
                element.buttonCustomizer(menuBtn, element);
            }

        }
        if (this.control) {
            /** @type {MenuHTMLElement} */
            const menuBtn = crIN(this.container, this.control.name, undefined,

                /** @param {MenuHTMLElement} btn */
                (btn) => this.setVisible(btn),
                /** @param {MenuHTMLElement} btn */
                (btn) => this.remove(btn)
                , undefined, {
                    style: {
                        left: 0 + "px",
                        width: this.offset + "px",
                        border: "1px solid black"
                    }
                })
            menuBtn.menu = this.control;
            menuBtn.bottom = 20;

            if (this.control.buttonCustomizer) {
                this.control.buttonCustomizer(menuBtn, this.control);
            }
        }

    }


    static async init() {
        await reqS("DOM/button");
    }
}