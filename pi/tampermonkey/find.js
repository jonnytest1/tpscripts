
/**
 * @type { import('./customTypes/declarations').ElementGetter }
 */
var elementGEtter = (string, iF, compress) => {
    if(!compress) {
        compress = true;
    }
    /**@type {any} */
    let obj = elementGEtter.I(string);
    if(!obj) {
        obj = elementGEtter.C(string, iF, compress);
    }
    if(!obj) {
        obj = elementGEtter.T(string, iF, compress);
    }
    return obj;
};
elementGEtter.T = function tag(string, iF, compress = true) {
    let list;
    if(iF !== undefined) {
        if(iF.localName === 'iframe') {
            list = iF['contentDocument'].getElementsByTagName(string);
        }
        else {
            list = iF.getElementsByTagName(string);
        }
    }
    else {
        list = window.document.getElementsByTagName(string);
    }
    if(list.length === 1 && compress === true) {
        return list[0];
    }
    else if(list.length === 0 && compress === true) {
        return undefined;
    }
    return list;
};
elementGEtter.I = function getById(string, iF) {
    if(iF !== undefined) {
        if(iF.localName === 'iframe') {
            return iF['contentDocument'].getElementById(string);
        }
        return undefined;
    }
    return document.getElementById(string);
};
elementGEtter.C = function className(string, iF, compress = true) {
    let list;
    if(iF !== undefined) {
        if(iF.localName === 'iframe') {
            list = iF['contentDocument'].getElementsByClassName(string);
        }
        else {
            list = iF.getElementsByClassName(string);
        }
    }
    else {
        list = document.getElementsByClassName(string);
    }
    if(list.length === 1 && compress === true) {
        return list[0];
    }
    else if(list.length === 0 && compress === true) {
        return undefined;
    }
    return list;
};
elementGEtter.c0 = function child(element, count = 0) {
    if(count === 0) {
        return element;
    }
    return child(element.children[0], count - 1);
};
elementGEtter.W = (top = false, wnd) => {
    //sc.D.l(location.host+" scripts.getwindow()",3);
    if(top) {
        if(wnd === undefined) {
            wnd = elementGEtter.W();
        }
        if(wnd.parentElement !== undefined) {
            return elementGEtter.W(true, wnd.parentElement);
        }
        else if(wnd.parentElement !== undefined) {
            return elementGEtter.W(true, wnd.parentElement);
        }
        else {
            return wnd.parentElement;
        }
    }
    if(window['unsafeWindow'] !== undefined) {
        return window['unsafeWindow'];
    }
    return window;
};
elementGEtter.a = async function get(identification, parent, tag, finder = elementGEtter) {
    /**
     * @type {string}
     */
    let searchString;
    if(typeof identification === 'object') {
        if(identification.querySelector) {
            searchString = identification.querySelector;
            finder = (id, parentElement = document) => parentElement.querySelector(id);
        }
        if(identification.finder) {
            finder = identification.finder;
        }

    } else {
        searchString = identification;
    }

    if(parent) {
        //console.log("waiting for " + identification + "with parent defined");
    }
    else {
        // console.log("waiting for " + identification);
    }
    return new Promise((resolve) => {
        function waitTillDefined(id) {
            let obj = finder(id, parent);
            if(obj instanceof NodeList && tag) {
                obj.forEach(o => {
                    // @ts-ignore
                    if(o.tagName === tag) {
                        obj = o;
                    }
                });
            }
            if(obj) {
                //console.log('found for ' + id);
                resolve(obj);
                return;
            }
            else {
                //console.log("didnt find for " + identification);
                setTimeout(waitTillDefined, 500, id);
            }
        }
        setTimeout(waitTillDefined, 10, searchString);
    });
};
elementGEtter.point = (x, y) => {
    if(typeof x !== 'number') {
        y = x.y;
        x = x.x;
    }
    /**
     * @type {any}
     */
    const object = document.elementFromPoint(x, y);
    return object;
};
/**
 *
 * @param {import("./customTypes/declarations").evalFncOptions & {first?:boolean,await?:boolean}} [options]
 * @param {keyof HTMLElementTagNameMap} type
 */
elementGEtter.eval = (type, options = {}) => {

    if(options.await) {
        return new Promise((resolver) => {
            // @ts-ignore
            const response = sc.g.eval(type, { ...options, await: false });
            if(!response) {
                setTimeout(() => {
                    resolver(elementGEtter.eval(type, options));
                }, 500);
            } else {
                resolver(response);
            }
        });
    }

    let conditions = '';
    if(options.text || options.class) {
        conditions = '[';
        let addedCondition = false;
        if(options.text) {
            conditions += `contains(., \'${options.text}\')`;
            addedCondition = true;
        }
        if(options.class) {
            for(let className of options.class) {
                if(addedCondition) {
                    conditions += ' and ';
                }
                conditions += `contains(@class, '${className}')`;
            }
        }
        conditions += ']';
    }
    /**
     * @type {any}
     */
    let parent = document;
    if(options.parent) {
        parent = options.parent;
    }

    let xpathCommand = `.//${type}${conditions}`;

    const iterator = document.evaluate(xpathCommand, parent, null, XPathResult.ANY_TYPE, null);
    /**
     * @type {Array<any>}
     */
    const results = [];
    let item = iterator.iterateNext();
    /**
     * @type {any}
     */
    let retValue = results;
    if(options.first) {
        retValue = item;
    }
    while(item !== null) {
        results.push(item);
        item = iterator.iterateNext();
    }

    if(options.first) {
        retValue = results[0];
    }
    return retValue;

};
sc.g = elementGEtter;
new EvalScript('', {}).finish(elementGEtter);
