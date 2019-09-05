// ==UserScript==
// @name         serveinject
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant GM_setValue
// @grant GM_getValue
// @require      https://raspberrypi.e6azumuvyiabvs9s.myfritz.net/tampermonkey/libs/standalone/serveReplacement.js
// ==/UserScript==

// @ts-ignore
var set = GM_setValue;
// @ts-ignore
var get = GM_getValue;

console.log('entry');
/**
 *
 * @typedef Annotation
 * @property {string} selector
 * @property {string} template
 * @property {Array<string>} styles
 *
 * @typedef {Function & {
 *   __annotations__: Array<Annotation>
 *   __prop__metadata__?:Object
 * }} PComponent

 *
 */
/**
 *
 * @param {*} appRef
 */
function getComponentList(appRef) {
    const facResolver = appRef._componentFactoryResolver;
    const factoryIterator = facResolver._factories.entries();
    /**
     * @type { Array<PComponent>}
     */
    const components = [];
    let cp = factoryIterator.next();
    while(cp) {
        if(cp.done) {
            break;
        }
        if(cp.value[1].selector !== 'ng-component') {
            cp.value[0].factory = cp.value[1];
            components.push(cp.value[0]);
        }

        cp = factoryIterator.next();
    }
    return components;

}

/**
 *
 * @param {PComponent} cp
 */
function getAnnotations(cp) {
    return cp.__annotations__[0];
}

// @ts-ignore
window.onAngular = (appRef, creator) => {

    const components = getComponentList(appRef);

    const properties = document.createElement('div');
    properties.style.position = 'fixed';
    properties.style.top = '10px';
    properties.style.right = '10px';

    const componentDropDown = document.createElement('select');
    components.forEach(cp => {
        const op = document.createElement('option');
        op.innerText = cp.name;
        op.value = cp.name;
        componentDropDown.appendChild(op);
    });

    let attributes = [];

    let selectedComponent = components[0];
    componentDropDown.onchange = (event) => {
        selectedComponent = components.find(cp => componentDropDown.value === cp.name);
        // @ts-ignore
        const options = GM_getValue('components_' + selectedComponent.name, '{}');
        addPropMeta(selectedComponent);
        //btn3.value = options;
    };
    properties.appendChild(componentDropDown);

    /**
     *
     * @param {PComponent} cp
     */
    function addPropMeta(cp) {
        attributes.forEach(att => att.remove());

        if(cp.__prop__metadata__) {
            const table = document.createElement('table');
            for(let key in cp.__prop__metadata__) {
                const row = document.createElement('tr');
                const label = document.createElement('td');
                label.textContent = key;
                const input = document.createElement('input');
                input.onchange = () => {
                    set(`component-${cp.name}-${key}`, input.value);
                };
                row.appendChild(label);
                row.appendChild(input);

                table.appendChild(row);
            }
            attributes.push(table);
            properties.appendChild(table);
        }
    }

    const btn = document.createElement('button');
    btn.textContent = 'make';
    btn.onclick = () => {
        const options = {};
        if(selectedComponent.__prop__metadata__) {
            for(let key in selectedComponent.__prop__metadata__) {
                let property = get(`component-${selectedComponent.name}-${key}`);
                try {
                    property = JSON.parse(property);
                } catch(e) {
                    //
                }
                options[key] = property;

            }
        }
        creator(getAnnotations(selectedComponent).selector, options);
    };
    properties.appendChild(btn);

    document.body.appendChild(properties);
};
