/* global sc,handleError */
/// <reference path="../DOM/line.js" />
/// <reference path="../DOM/button.js" />
class MenuElement {

    /**
     *
     * @param {MenuElementItem} props
     */
    constructor(props) {
        for (let i in props) {
            this[i] = props[i];
        }
        if (this.children) {
            this.children = MenuElement.parse(this.children);
        }
    }

    /**
     *
     * @param {MenuElementItem[]} elements
     * @returns {Array<MenuElement>}
     */
    static parse(elements) {
        return elements.map(el => new MenuElement(el));
    }

}

/**
 *
 * @typedef {CircularMenu} CircularMenuC
 *
 */
//tslint:disable-next-line variable-name
var CircularMenu = class CircularMenuC {

    /**

     * @typedef MenuElementItem
     * @property { MenuElementItem[] } [children]
     * @property {String} [name]
     * @property {Function} [onclick]
     * @property {(parent:HTMLElement)=>boolean|void} [mouseOver]
     * @property {(target)=>boolean} [isValid]
     * @property {Function } [creationFunction]
     * @property {String} [enabledColor]

     */

    /**

     * @typedef {HTMLElement & {
     *      menuOption:MenuElementItem,
     *      center:Center,
     *      menu:CircularMenu,
     *      degree:number,
     *      parentSpace:number
     * }} CircularMenuHTMLButton
     */

    /**
     * @param {HTMLElement} parent
     * @param {MenuElementItem[]} elements
     * @param {{ deactivatorChoice?:string, deactivator?:()=>Promise<Event>, activator?:()=>Promise<Event>, getCenter?:()=>{x:number,y:number,target:HTMLElement}}} options
     */
    constructor(parent, elements, options = {}) {
        this.isActive = false;
        this.parent = parent;
        /**@type {Array<MenuElementItem>}*/
        this.elements = MenuElement.parse(elements);
        this.deactivators = { timedDeactivation: this.timedDeactivation };
        this.deactivatorChoice = options.deactivatorChoice || 'timedDeactivation';

        if (options.deactivator) {
            this.deactivators.customDeactivator = options.deactivator;
            this.deactivatorChoice = 'customDeactivator';
        }
        if (options.getCenter) {
            this.getCenter = options.getCenter;
        }
        if (options.activator) {
            this.activator = options.activator;
        }
        this.activator()
            .then(ev => this.onActivate.call(this, ev));
    }
    onActivate(ev) {
        try {
            this.isActive = true;
            this.initialize.call(this, ev);
            this.deactivationFunction();
        } catch (e) {
            handleError(e);
        }
    }
    async deactivationFunction() {
        await this.backgroundObj.deactivation();
        this.isActive = false;
        this.backgroundObj.remove();
        this.activator()
            .then(ev => this.onActivate.call(this, ev));
    }

    async activator() {
        return new Promise((resolver) => {
            this.parent.addEventListener('mouseenter', (ev) => {
                resolver(ev);
            });
        });
    }
    async timedDeactivation(button) {
        return new Promise((resolver) => {
            setTimeout(() => resolver(button), 3000);
        });
    }

    getCenter(center) {
        return {
            x: center.x,
            y: center.y,
            target: center.target
        };
    }
    set(obj) {
        if (sc.circularmenu) {
            sc.circularmenu.remove();
        }

        sc.circularmenu = obj;
        return obj;
    }

    getBackgroundObject(center, radius) {
        let parent = sc.menuContainer;
        let el = document.elementFromPoint(center.x, center.y);
        if (el && el.tagName.toUpperCase() === 'VIDEO') {
            parent = el.parentElement;
        }
        let backgroundObject = this.set(crIN(parent, '', undefined, undefined, btn => {
            //btn.remove();
        }, undefined, {
                style: {
                    borderRadius: `${radius}px`,
                    width: `${radius}px`,
                    height: `${radius}px`,
                    left: `${center.x - (radius / 2)}px`,
                    top: `${center.y - (radius / 2)}px`,
                    visibility: 'visible',
                    backgroundColor: 'rgba(206, 53, 53, 0.4)',
                }
            }));
        backgroundObject.position = center;
        backgroundObject.deactivation = this.deactivators[this.deactivatorChoice];
        return backgroundObject;
    }

    filterOptions(option) {
        if (!option.isValid) {
            return true;
        } else {
            return option.isValid(this.center.target);
        }
    }

    /**
     * @param {string} name
     */
    removeByName(name) {
        this.filter(m => m.name !== name);
    }
    /**

     * @param {(menu:MenuElementItem)=>boolean} filterfnc
     */
    filter(filterfnc) {
        this.elements = this.elements.filter(filterfnc);
    }

    /**
     * @param {MenuElementItem} menu
     */
    addToMenu(menu, selector = ((el) => el)) {
        let node = selector(this.elements);
        if (node instanceof MenuElement) {
            if (!node.children) {
                node.children = [];
            }
            node = node.children;
        }
        node.push(new MenuElement(menu));
        this.initialize();

    }
    initialize(ev) {
        if (this.elements.length > 0 && this.isActive) {

            this.center = this.getCenter(ev);

            let filteredOptions = this.elements.filter(el => this.filterOptions(el));
            let radius = 100;

            if (filteredOptions.length > 4) {
                radius = 200;
            }
            this.backgroundObj = this.getBackgroundObject(this.center, radius);
            this.setButtons(filteredOptions, 0, 360, radius, this.center);
        }
    }
    /**

     * @param {*} parent
     * @param {*} text
     * @param {*} onclick
     * @param {*} fncmouseEnter
     * @param {*} fncMouseLeave
     * @param {*} style
     * @param {Center&{target:HTMLElement}} center
     * @param {*} menu
     */
    createElement(parent, text = '', onclick, fncmouseEnter, fncMouseLeave, style, center, menu) {
        let sradius = 50;
        /** @type {HTMLElement& {center?:Center}} */
        let element = crIN(parent, text, onclick, fncmouseEnter, fncMouseLeave, undefined, style);
        element.style.width = `${sradius}px`;
        element.style.height = `${sradius}px`;

        element.style.left = `${center.x - (sradius / 2)}px`;
        element.style.top = `${center.y - (sradius / 2)}px`;
        element.center = center;
        return element;
    }

    /**

     * @param {*} buttonArray
     * @param {*} startAngle
     * @param {*} availableAngle
     * @param {*} distance
     * @param {Center&{target:HTMLElement}} center
     * @param {*} parent
     */
    setButtons(buttonArray, startAngle, availableAngle, distance, center, parent = this.backgroundObj) {

        buttonArray = buttonArray.filter(el => this.filterOptions(el));
        let degree = availableAngle / (buttonArray.length);

        if (buttonArray.length === 1) {
            availableAngle = 0;
            degree = 0;
        }

        let innerRadius = distance * 0.4;
        for (let i = 0; i < buttonArray.length; i++) {
            let angle = ((startAngle - availableAngle / 2) + (degree * i));
            let posX = (Math.cos(angle * (Math.PI / 180)) * innerRadius);
            let posY = (Math.sin(angle * (Math.PI / 180)) * innerRadius);

            let newElementCenterX = center.x + posX;
            let newElementCenterY = center.y + posY;

            let creationFunction = buttonArray[i].creationFunction || this.createElement;

            let newCenter = { ...center, x: newElementCenterX, y: newElementCenterY };

            let line = new Line(parent, center, newCenter, 36);

            /** @type  { CircularMenuHTMLButton } */
            let buttonInstance = creationFunction(parent, buttonArray[i].name || '', (() => {
                let fnc = buttonArray[i].onclick;
                return (btn) => {
                    fnc(btn);
                    btn.parentElement.remove();
                };
            })(),
                /** @param { CircularMenuHTMLButton } btn */
                (btn) => {
                    btn.style.backgroundColor = btn.menuOption.enabledColor || 'green';
                    if (btn.menuOption.mouseOver) {
                        if (btn.menuOption.mouseOver(btn.parentElement) === false) {
                            return;
                        }
                    }
                    if (btn.menuOption.children) {
                        for (let button of buttonArray) {
                            if (button.children) {
                                for (let j of button.children) {
                                    if (j.element) {
                                        j.element.remove();
                                    }
                                    if (j.line) {
                                        j.line.remove();
                                    }
                                }
                            }

                        }
                        buttonInstance.menu.setButtons.call(buttonInstance.menu, btn.menuOption.children, btn.degree, 90, 100 + (35 * btn.menuOption.children.length), btn.center);
                    }
                }, (btn) => btn.style.backgroundColor = 'white'
                , {
                    target: center.target,
                    style: {
                        borderRadius: `${distance}px`,
                        visibility: 'visible',
                        backgroundColor: 'rgba(0, 0, 53, 0.4)'
                    }
                }, newCenter, angle, this);

            buttonInstance.center = newCenter;
            buttonInstance.menuOption = buttonArray[i];
            buttonInstance.degree = angle;
            buttonInstance.parentSpace = degree;
            buttonInstance.menu = this;
            buttonArray[i].element = buttonInstance;
            buttonArray[i].line = line;
        }
    }
    static async main() {

        await reqS('DOM/line');

        await reqS('DOM/button');

        async function activator() {
            return new Promise((resolver) => {
                function onKeyDown(event) {
                    if (event.key === 'Control') {
                        document.removeEventListener('keydown', onKeyDown);
                        resolver(event);
                    }
                }
                document.addEventListener('keydown', onKeyDown);
            });

        }
        async function deactivator() {
            return new Promise((resolver) => {
                function onKeyUp(event) {
                    if (event.key === 'Control') {
                        document.removeEventListener('keyup', onKeyUp);
                        resolver(event);
                    }
                }
                document.addEventListener('keyup', onKeyUp);
            });
        }
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let menu = new CircularMenu(document.body, [{
            name: 'test',
            isValid: () => true,
            mouseOver: () => {
                reqS('http')
                    .then(t => t.http('GET', 'http://localhost:4280/test/test.php'))
                    .then(data => {
                        console.log(data);
                        debugger;
                        GM_setClipboard(data);
                    });
            }
        }
        ], {
                activator: activator,
                deactivator: deactivator,
                getCenter: () => ({ ...mouse, target: document.body })
            });

        window.addEventListener('mousemove', (ev) => {
            mouse = { x: ev.x, y: ev.y };
            if (menu) {
                //menu.initialize(ev);
            }
        });
        sc.menu = menu;
        return menu;
    }
};