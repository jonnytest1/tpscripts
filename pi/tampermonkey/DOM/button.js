/// <reference path="../customTypes/index.d.ts" />

/**
 * @typedef ButtonOptions
 * @property {HTMLElement} [parent]
 * @property {()=>any} [onclick]
 * @property {string} text
 * @property {OptionalStyle} [styles]
 */

/**
 * @typedef ButtonRes
 * @property {typeof crIN} crIN
 * @property {typeof crBE} crBE
 */
new EvalScript('', {
    reset: () => { return; },
    run: async (resolver) => {
        /**
         *  @name dom_b
         */
        const constants = await reqS('DOM/DOMConstants');

        /** @global */
        //tslint:disable-next-line variable-name
        var Button = class ButtonC {

            //tslint:disable-next-line
            static btn(txt, fncclick, fncmouseEnter, fncMouseLeave, fncopen, style) {
                let btn = document.createElement('tampermonkey-button');
                let backgroundcolor = 'white';
                let txtcolor = '#333'; //black
                if(location.href.indexOf('twitter') > -1) {
                    backgroundcolor = '#1DA1F2';
                }
                else if(location.href.indexOf('kissanime') > -1) {
                    backgroundcolor = '#161616';
                    // txtcolor = '#d5f406';
                }
                else if(location.href.indexOf('kissmanga') > -1) {
                    backgroundcolor = '#161616';
                    //txtcolor = '#72cefe';
                }
                else if(location.href.indexOf('instagram') > -1) {
                    backgroundcolor = '#fafafa';
                }
                else if(location.href.indexOf('facebook') > -1) {
                    backgroundcolor = '#fafafa';
                }
                else if(location.href.indexOf('youtube') > -1) {
                    backgroundcolor = '#fafafa';
                }
                else if(location.href.indexOf('bs.to') > -1) {
                    backgroundcolor = '#07559a';
                }
                else if(location.href.indexOf('cine.to') > -1) {
                    backgroundcolor = '#fff';
                }
                btn.style.backgroundColor = backgroundcolor;
                btn.style.textAlign = 'center';
                btn.style.color = txtcolor;
                btn.style.cursor = 'pointer';
                btn.style.fontSize = 'initial';
                btn.style.position = 'fixed';
                btn.style.zIndex = constants.zIndex.toString();
                try {
                    if(style) {
                        if(style.constructor.name === 'Object') {
                            for(let j in style) {
                                if(style[j].constructor.name === 'Object') {
                                    for(let k in style[j]) {
                                        if(typeof style[j][k] === 'number' && (
                                            k === 'width'
                                            || k === 'left'
                                            || k === 'height'
                                            || k === 'bottom'
                                            || k === 'borderRadius'
                                            || k === 'right')) {
                                            style[j][k] += 'px';
                                        }
                                        btn[j][k] = style[j][k];
                                    }
                                }
                                else {
                                    btn[j] = style[j];
                                }
                            }
                        }
                        else {
                            for(let styleEl of style) {
                                btn[styleEl[0]] = JSON.stringify(styleEl[1]);
                            }
                        }
                        if(btn['property']) {
                            throw new Error('havent implemented GM lsitener');
                            // eslint-disable-next-line no-unreachable
                            addEventListener('GM', btn['property'], function(a, b, c, d, e) {
                                if(e) {
                                    this.sc.D.e('not implemented at DOM button()');
                                    //btn['onclick'](a, d);
                                }
                                // @ts-ignore
                            }, { target: btn });
                        }
                    }
                } catch(e) {
                    debugger;
                }
                btn['hrefs'] = fncopen;
                if(fncopen) {
                    let link = document.createElement('a');
                    btn.appendChild(link);
                    link['hrefs'] = btn['hrefs'];
                    if(fncopen.constructor.name === 'Array') {
                        link.href = btn['hrefs'][0];
                    }
                    else {
                        link.href = btn['hrefs'];
                    }
                    link.onclick = (event) => {
                        if(event.target['hrefs']) {
                            if(event.target['hrefs'].constructor.name === 'Array') {
                                open(event.target['hrefs'][0], location.href, undefined, event.target['hrefs'][1]);
                            }
                            else {
                                open(event.target['hrefs'], location.href);
                            }
                        }
                    };
                    link.style.visibility = 'inherit';
                    link.style.top = '4px';
                    link.style.width = '100%';
                    link.style.left = '0px';
                    link.style.height = 'inherit';
                    link.style.position = 'absolute';
                    link.style.zIndex = 'inherit';
                    link.style.color = 'inherit';
                    link.style.cursor = 'inherit';
                    //link.style.padding="inherit";
                }
                if(txt) {
                    if(txt.constructor.name !== 'String') {
                        txt = JSON.stringify(txt);
                    }
                    let txtar = txt.split('\n');
                    if(txtar[0].length > 0) {
                        let textElement = document.createElement('tampoermonkey-text');
                        textElement.textContent = txtar[0];
                        textElement.style.position = 'relative';
                        textElement.style.top = `calc(50% - ${(txtar.length * 21 / 2 + ((txtar.length - 1) * 6))}px)`;
                        textElement.style.font = '1em/1.4 Palatino arial,sans-serif';
                        textElement.style.wordWrap = 'initial';
                        btn.appendChild(textElement);
                    }
                    for(let i = 1; i < txtar.length; i++) {
                        btn.appendChild(document.createElement('BR'));
                        if(txtar[i].length > 0) {
                            let textElement = document.createElement('tampoermonkey-text');
                            textElement.style.position = 'relative';
                            textElement.style.top = `calc(50% - ${(txtar.length - i) * 21 / 2 + ((txtar.length - 1) * 6)}px)`;
                            textElement.textContent = txtar[i];
                            btn.appendChild(textElement);
                        }
                    }
                }
                btn.id = 'custom_script' + sc.D.n++;
                btn['clickts'] = -1000;
                btn.onclick = ((clickFnc, button) => {
                    return (event) => {
                        if(event.target['clickts'] + 500 > event.timeStamp) {
                            console.log(event.timeStamp + ' blocked');
                            return;
                        }
                        console.log(event.timeStamp);
                        event.target['clickts'] = event.timeStamp;
                        if(clickFnc !== null && clickFnc !== undefined) {
                            if(sc.D.c) {
                                try {
                                    clickFnc(button);
                                }
                                catch(error) {
                                    handleError(error);
                                }
                            }
                            else {
                                clickFnc(button);
                            }
                        }
                    };
                })(fncclick, btn);

                if(fncmouseEnter !== null && fncmouseEnter !== undefined) {
                    btn.onmouseenter = function mouseenterlsitener(e) {
                        try {
                            fncmouseEnter(e.target);
                        }
                        catch(er) {
                            handleError(er);
                        }
                    };
                }
                if(fncMouseLeave !== null && fncMouseLeave !== undefined) {
                    btn.addEventListener('mouseleave', function mouseleavelsitener() {
                        try {
                            fncMouseLeave.call(this, btn);
                        } catch(er) {
                            handleError(er);
                        }
                    });
                }
                return btn;
            }
            /**
             * @param {HTMLElement} element
             * @param {string} txt
             * @param {Function} fnct
             * @param {Function} fncmouseEnter
             * @param {Function} fncMouseLeave
             * @param {string} fncopen
             * @param {StyleSheet} style
             */
            static crBE(element, txt, fnct, fncmouseEnter, fncMouseLeave, fncopen, style) {
                let btn = Button.btn(txt, fnct, fncmouseEnter, fncMouseLeave, fncopen, style);
                element.parentNode.insertBefore(btn, element);
                return btn;
            }

            /**
             * creates a button in element
             * @param {HTMLElement|ButtonOptions} element
             * @param {string} txt
             * @param {*} fncclick
             * @param {*} fncmouseEnter
             * @param {*} fncMouseLeave
             * @param {*} fncopen
             * @param {*} style
             */
            static crIN(element = document.body, txt, fncclick, fncmouseEnter, fncMouseLeave, fncopen, style) {
                if(!(element instanceof HTMLElement)) {
                    fncclick = element.onclick;
                    txt = element.text;
                    style = { style: element.styles };

                    element = element.parent || document.body;
                }

                let btn = Button.btn(txt, fncclick, fncmouseEnter, fncMouseLeave, fncopen, style);
                element.appendChild(btn);
                return btn;
            }
        };
        window.crIN = Button.crIN;
        window.crBE = Button.crBE;
        resolver({
            crIN: Button.crIN,
            crBE: Button.crBE
        });

        return true;
    }
});