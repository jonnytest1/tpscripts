/* tslint:disable:no-invalid-this */
(async () => {

    /**
 *
 * @param {string} tagName
 */
    var createComponent = async (tagName, options) => {
        const prev = document.querySelector(tagName);
        let parent = document.body;
        if(prev) {
            if(prev.parentElement) {
                parent = prev.parentElement;
            }
            prev.remove();

        }
        await sleep(200);
        const element = document.createElement(tagName);

        /**
       * @type {import('../../../bas/serveinject/node_modules/@angular/core').ɵCodegenComponentFactoryResolver}
       */
        // @ts-ignore
        const facResolver = appRef._componentFactoryResolver;

        let component = getComponentConstructor(tagName);
        const factory = facResolver.resolveComponentFactory(component);
        // @ts-ignore
        const popupComponentRef = factory.create(appRef._injector, [], element);
        appRef.attachView(popupComponentRef.hostView);

        const comp = popupComponentRef.instance;
        const atts = options;
        for(let i in atts) {
            comp[i] = atts[i];
        }
        popupComponentRef.changeDetectorRef.detectChanges();
        parent.appendChild(element);
        component.nativeElement = element;
        return comp;
    };

    /**@type {import('../../../bas/serveinject/node_modules/@angular/core').ApplicationRef}  import('@angular/core').ApplicationRef */
    let appRef = await getAppRef();
    if(window['onAngular']) {
        window['onAngular'](appRef, createComponent);
    }

    async function getAppRef() {
        return new Promise(resolver => {
            const type = Array;
            const str = 'forEach';
            let found = false;
            const orig = type.prototype[str];
            type.prototype[str] = function(...args) {
                if(typeof args[0] === 'function') {
                    orig.call(this, el => {
                        if(el && el.constructor.name === 'ViewRef_') {
                            // around webpack://./node_modules/@angular/code/fesm5/core.js:14788
                            // this._views.forEach(function (view) { return view.detectChanges(); });
                            try {
                                //update as well
                                appRef = el._appRef;
                                console.log('updated appref');
                            } catch(e) {
                                //
                            }
                            resolver(el._appRef);
                        }
                    });
                }
                return orig.call(this, ...args);
            };

        });
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getComponentConstructor(str) {
        /**
         * @type {import('../../../bas/serveinject/node_modules/@angular/core').ɵCodegenComponentFactoryResolver}
         */
        // @ts-ignore
        const facResolver = appRef._componentFactoryResolver;
        // @ts-ignore
        const factoryIterator = facResolver._factories.entries();
        let cp = factoryIterator.next();
        while(cp) {
            if(cp.done) {
                break;
            }
            if(cp.value[1].selector === str) {
                return cp.value[0];
            }
            cp = factoryIterator.next();
        }
        throw 'couldnt find ' + str;

    }

})();

(function setMainModuleAccepted() {
    Function.prototype['oCall'] = Function.prototype.call;
    Function.prototype.call = function(...args) {
        const arg1 = args[1];
        if(arg1 && arg1.hot && arg1.i && arg1.i === './src/main.ts'
        ) {
            // around webpack://webpack/bootstrap:782
            // modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
            arg1.hot.accept();
        }
        const callResult = this['oCall'](...args);
        return callResult;
    };

})();