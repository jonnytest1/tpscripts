/* global sc,handleError */
/// <reference path="../DOM/line.js" />
/// <reference path="../DOM/button.js" />
/// <reference path="../customTypes/index.d.ts" />

/**
*
* @typedef {HTMLElement & {
*      menuOption?:MenuElementItem,
*      center?:Vector,
*      menu?:CircularMenuInstnace,
*      degree?:number,
*      parentSpace?:number
* }} CircularMenuHTMLButton
*/
/**
* @typedef MenuElementItem
* @property { MenuElementItem[] } [children]
* @property {String} [name]
* @property {Function} [onclick]
* @property {(parent:HTMLElement,btn:CircularMenuHTMLButton)=>boolean|void} [mouseOver]
* @property {(parent:HTMLElement,btn:CircularMenuHTMLButton)=>boolean|void} [mouseLeave]
* @property {(target)=>boolean} [isValid]
* @property {CreateElement} [creationFunction]
* @property {Colors} [enabledColor]
* @property {Colors} [normalColor]
* @property {CircularMenuHTMLButton} [element]
* @property {number} [rotation]
* @property {Line} [line]
* @property {string} [lib]
*/

/**
 * @callback addToMEnuCB
 * @param {MenuElementItem} menu
 * @param {(ar:MenuElementItem[])=>MenuElementItem|MenuElementItem[]} [selector]
 * @returns {void}
 */

// parent, text = '', onclick, fncmouseEnter, fncMouseLeave, style, center, menu
/**
 * @typedef CircularMenuInstnace
 * @property {addToMEnuCB} addToMenu
 * @property {CreateElement} createElement
 * @property {Function} [setButtons]
 * @property {()=>void} remove
 * @property {(rootMenuName:String)=>void} removeByName
 * @property { (libName:string) => void } removeByLib
 *
 * @typedef {(
 *  parent,
 *  text:string,
 *  onclick:Function,
 *  mouseEnter:Function,
 *  mouseLEave:Function,
 *  style:any,
 *  center:Vector,
 *  angle:number,
 *  menu:CircularMenuInstnace
 * )=>CircularMenuHTMLButton} CreateElement
 *
 *
 *
 * @typedef  {CircularConstructor &
 *  {main:()=>CircularMenuInstnace
 * }} CircularMenuResolv
 */

/**
* @typedef {new (
*   parent:HTMLElement,
*   elements:MenuElementItem[],
*   options?:{
*       deactivatorChoice?:string
*       deactivator?:(backgroundObj) => Promise<Event>
*       activator?:() => Promise<Event>
*       getCenter?:() => { x: number, y: number, target: HTMLElement; }
*       scale?:number
* }) => CircularMenuInstnace} CircularConstructor
*
*
*/

/**
*
*@typedef CircularConstructorOptions
*@property {string} [deactivatorChoice]
*@property {()=>Promise<Event>} [deactivator]
*@property {()=>Promise<Event>} [activator]
*@property {()=>{x:number,y:number,target:HTMLElement}} [getCenter]
*@property {number} [scale]
*/
new EvalScript('', {
    run: async (resolver, response) => {
        (async () => {
            await reqS('DOM/line');

            await reqS('DOM/button');
            /**
             *
             * @param {MenuElementItem} props
             */
            function parseMElement(props) {
                if(props.children) {
                    props.children = props.children.map(parseMElement);
                }
                if(!props.lib && EvalScript.current) {
                    props.lib = EvalScript.current.getUrl();
                    // console.log(`setting ${props.lib} as lib for ${props.name}`);
                }
                return props;

            }
            /**
             *
             * @call {CircularMenu} CircularMenuC
             *
             */
            //tslint:disable-next-line variable-name
            var CircularMenu = class CircularMenuC {

                /**
                 * @type {CircularConstructor}
                 * @param {CircularConstructorOptions} [options]
                 * @param {MenuElementItem[]} elements
                 * @param {HTMLElement} parent
                */
                constructor(parent, elements, options = {}) {
                    this.isActive = false;
                    this.destroyed = false;
                    this.parent = parent;
                    /**@type {Array<MenuElementItem>}*/
                    this.elements = parseMElement({ children: elements }).children;
                    this.deactivators = { timedDeactivation: this.timedDeactivation };
                    this.deactivatorChoice = options.deactivatorChoice || 'timedDeactivation';

                    if(options.deactivator) {
                        this.deactivators.customDeactivator = options.deactivator;
                        this.deactivatorChoice = 'customDeactivator';
                    }
                    if(options.getCenter) {
                        this.getCenter = options.getCenter;
                    }

                    this.activator = options.activator || this.defaultActivator;

                    this.scale = options.scale | 1;
                    this.activator()
                        .then(ev => this.onActivate.call(this, ev));
                }
                onActivate(ev) {
                    if(this.destroyed) {
                        return;
                    }
                    try {
                        this.isActive = true;
                        this.initialize.call(this, ev);
                        this.deactivationFunction();
                    } catch(e) {
                        handleError(e);
                    }
                }
                async deactivationFunction() {
                    if(this.backgroundObj) {
                        await this.backgroundObj.deactivation(this.backgroundObj);
                    }
                    this.leave(this.elements);
                    this.isActive = false;
                    if(this.backgroundObj) {
                        this.backgroundObj.remove();
                    }
                    this.activator()
                        .then(ev => this.onActivate.call(this, ev));
                }

                async defaultActivator() {
                    return new Promise(resolv => {
                        this.parent.addEventListener('mouseenter', (ev) => {
                            resolv(ev);
                        });

                    });
                }
                async timedDeactivation(button) {
                    return new Promise(resolv => {
                        setTimeout(() => resolv(button), 3000);
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
                    if(sc.circularmenu) {
                        sc.circularmenu.remove();
                    }

                    sc.circularmenu = obj;
                    return obj;
                }
                getBackgroundObject(center, radius) {
                    let parent = sc.menuContainer;
                    /**@type {HTMLElement} */
                    // @ts-ignore
                    let el = document.elementFromPoint(center.x, center.y);
                    if(el && el.tagName.toUpperCase() === 'VIDEO' && document.fullscreen) {
                        parent = el.parentElement;
                    }
                    const scaledRadius = radius * this.scale;
                    let alphaFilter = this.set(crIN(parent, '', () => el.click(), undefined, (btn) => {

                        return;
                        this.isActive = false;
                        btn.remove();
                        this.leave(this.elements);
                        this.activator()
                            .then(ev => this.onActivate.call(this, ev));
                    }, undefined, {
                        style: {
                            borderRadius: `${scaledRadius}px`,
                            width: `${scaledRadius}px`,
                            height: `${scaledRadius}px`,
                            left: `${center.x - (scaledRadius / 2)}px`,
                            top: `${center.y - (scaledRadius / 2)}px`,
                            visibility: 'visible',
                            backgroundColor: 'rgba(255, 240, 240, 0.8)',
                        }
                    }));
                    alphaFilter.position = center;

                    alphaFilter.deactivation = this.deactivators[this.deactivatorChoice];
                    if(!alphaFilter.deactivation) {
                        debugger;
                    }
                    return alphaFilter;
                }

                filterOptions(option) {
                    if(!option.isValid) {
                        return true;
                    } else {
                        return option.isValid(this.center.target);
                    }
                }
                /**
                 *
                 * @param {Array<MenuElementItem>} els
                 */
                leave(els) {
                    console.log('leave');
                    els.forEach(element => {
                        if(element.mouseLeave) {
                            element.mouseLeave(this.backgroundObj, element.element);
                        }
                        if(element.children) {
                            this.leave(element.children);
                        }
                    });
                }

                async remove() {
                    if(this.backgroundObj) {
                        await this.backgroundObj.deactivation(this.backgroundObj);
                        console.trace('menu deactivation event');
                    }
                    this.leave(this.elements);
                    this.destroyed = true;
                    this.isActive = false;
                    if(this.backgroundObj) {
                        this.backgroundObj.remove();
                    }
                }
                /**
                 * @param {string} name
                 */
                removeByName(name) {
                    this.filter(m => m.name !== name);
                }

                /**
                 * @param {string} lib
                 */
                removeByLib(lib) {
                    this.filter(m => m.lib !== lib);
                }

                /**

                 * @param {(menu:MenuElementItem)=>boolean} filterfnc
                 */
                filter(filterfnc) {
                    this.elements = this.elements.filter(filterfnc);
                }
                /**@type {addToMEnuCB} */
                addToMenu(menu, selector = ((el) => el)) {
                    let node = selector(this.elements);
                    if(!(node instanceof Array)) {
                        if(!node.children) {
                            node.children = [];
                        }
                        node = node.children;
                    }
                    node.push(parseMElement(menu));
                    this.initialize();

                }
                initialize(ev) {
                    if(this.elements.length > 0 && this.isActive) {

                        this.center = this.getCenter(ev);

                        let filteredOptions = this.elements.filter(el => this.filterOptions(el));
                        let radius = 100;

                        if(filteredOptions.length > 4) {
                            radius = 200;
                        }
                        this.backgroundObj = this.getBackgroundObject(this.center, radius);
                        this.setButtons(filteredOptions, 0, 360, radius, this.center);
                    } else {
                        console.log('no elements');
                    }
                }
                /**
                 * @type {CreateElement}
                 */
                createElement(parent, text = '', onclick, fncmouseEnter, fncMouseLeave, style, center, angle, menu) {
                    let sradius = 50;
                    /** @type {CircularMenuHTMLButton} */
                    let element = crIN(parent, text, onclick, fncmouseEnter, fncMouseLeave, undefined, style);
                    element.style.width = `${sradius}px`;
                    element.style.height = `${sradius}px`;

                    element.style.left = `${center.x - (sradius / 2)}px`;
                    element.style.top = `${center.y - (sradius / 2)}px`;
                    element.center = center;
                    return element;
                }

                /**

                 * @param {Array<MenuElementItem>} buttonArray
                 * @param {*} startAngle
                 * @param {*} availableAngle
                 * @param {*} distance
                 * @param {Vector&{target:HTMLElement}} center
                 * @param {*} parent
                 */
                setButtons(buttonArray, startAngle, availableAngle, distance, center, parent = this.backgroundObj) {

                    buttonArray = buttonArray.filter(el => this.filterOptions(el));
                    let degree = availableAngle / (buttonArray.length);

                    if(buttonArray.length === 1) {
                        availableAngle = 0;
                        degree = 0;
                    }

                    let innerRadius = distance * 0.4;

                    let rotationArray = [];
                    for(let i = 0; i < buttonArray.length; i++) {
                        let angle = ((startAngle - availableAngle / 2) + (degree * i));
                        rotationArray[i] = angle;
                    }
                    let rotationOffset = 0;
                    for(let i = 0; i < buttonArray.length; i++) {
                        if(buttonArray[i].rotation !== undefined) {
                            rotationOffset = buttonArray[i].rotation - rotationArray[i];
                            break;
                        }
                    }

                    for(let i = 0; i < buttonArray.length; i++) {
                        let angle = rotationArray[i] + rotationOffset;
                        let posX = (Math.cos(angle * (Math.PI / 180)) * innerRadius);
                        let posY = (Math.sin(angle * (Math.PI / 180)) * innerRadius);

                        let newElementCenterX = center.x + posX;
                        let newElementCenterY = center.y + posY;

                        /**@type {CreateElement} */
                        let creationFunction = buttonArray[i].creationFunction || this.createElement;

                        let newCenter = { ...center, x: newElementCenterX, y: newElementCenterY };

                        let line = new Line(parent, center, newCenter, 36);

                        let buttonInstance = creationFunction(
                            parent, buttonArray[i].name || '',
                            (() => {
                                let fnc = buttonArray[i].onclick;
                                return (btn) => {
                                    fnc(btn);
                                    btn.parentElement.remove();
                                };
                            })(),
                            /** @param { CircularMenuHTMLButton } btn */
                            (btn) => {
                                btn.style.backgroundColor = btn.menuOption.enabledColor || 'green';
                                if(btn.menuOption.mouseOver) {
                                    if(btn.menuOption.mouseOver(btn.parentElement, btn) === false) {
                                        return;
                                    }
                                }
                                if(btn.menuOption.children) {
                                    for(let button of buttonArray) {
                                        if(button.children) {
                                            for(let j of button.children) {
                                                if(j.element) {
                                                    j.element.remove();
                                                }
                                                if(j.line) {
                                                    j.line.remove();
                                                }
                                            }
                                        }
                                    }
                                    buttonInstance.menu.setButtons.call(buttonInstance.menu, btn.menuOption.children, btn.degree, 90, 100 + (35 * btn.menuOption.children.length), btn.center);
                                }
                            },

                            /**
                             * mouseLeave
                             * @param { CircularMenuHTMLButton } btn */
                            (btn) => {
                                btn.style.backgroundColor = (btn.menuOption.normalColor || 'white');
                                if(btn.menuOption.mouseLeave) {
                                    if(btn.menuOption.mouseLeave(btn.parentElement, btn) === false) {
                                        return;
                                    }
                                }
                            }
                            , {
                                target: center.target,
                                style: {
                                    borderRadius: `${distance}px`,
                                    visibility: 'visible',
                                    backgroundColor: 'rgba(255,255,255, 0.4)',
                                    whiteSpace: 'noWrap'
                                }
                            },
                            newCenter,
                            angle,
                            this
                        );

                        buttonInstance.center = newCenter;
                        buttonInstance.menuOption = buttonArray[i];
                        buttonInstance.degree = angle;
                        buttonInstance.parentSpace = degree;
                        buttonInstance.menu = this;
                        if(buttonArray[i].normalColor) {
                            buttonInstance.style.backgroundColor = buttonArray[i].normalColor;
                        }
                        buttonArray[i].element = buttonInstance;
                        buttonArray[i].line = line;
                    }
                }
                static async main() {

                    async function activator() {
                        return new Promise(resolv => {
                            function onKeyDown(event) {
                                if(event.key === 'Control' || event.ctrlKey) {
                                    document.removeEventListener('keydown', onKeyDown);
                                    window.removeEventListener('mousemove', onKeyDown);
                                    resolv(event);

                                }
                            }
                            window.addEventListener('mousemove', onKeyDown);
                            document.addEventListener('keydown', onKeyDown);
                        });

                    }
                    async function deactivator(background) {
                        return new Promise(resolv => {
                            function onKeyUp(event) {
                                if(event.key === 'Control' || !event.ctrlKey) {
                                    document.removeEventListener('keyup', onKeyUp);
                                    background.removeEventListener('keyup', onKeyUp);
                                    resolv(event);
                                }
                            }
                            background.addEventListener('keyup', onKeyUp);
                            document.addEventListener('keyup', onKeyUp);
                        });
                    }
                    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
                    let menu = new CircularMenu(document.body, [], {
                        activator: activator,
                        deactivator: deactivator,
                        scale: 6,
                        getCenter: (ev) => ({ ...mouse, target: document.fullscreen ? ev.target.parentElement : document.body })
                    });

                    window.addEventListener('mousemove', (ev) => {
                        mouse = { x: ev.x, y: ev.y };
                        if(menu) {
                            //menu.initialize(ev);
                        }
                    });
                    sc.menu = menu;
                    return menu;
                }
            };

            await CircularMenu.main();

            resolver(CircularMenu);
        })();
        return true;
    },
    reset: () => {
        sc.menu.remove();
    },
    afterReset: async () => {
        //await req(window.backendUrl + '/req.php?url=test/php/testing', { cache: false });
    }
});
