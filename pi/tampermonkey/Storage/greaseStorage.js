/// <reference path="../customTypes/index.d.ts" />
// eslint-disable-next-line no-unused-vars
function grease() {

	var G = {
		s: (identifier, element) => {
			window['GM_getValue'] ? window['GM_setValue'](identifier, element) : localStorage[identifier] = JSON.stringify(element);
		},
		/**
		* @param { String } identifier ""
		* @param { any } standard ""
		* @returns {any}
		*/
		g: (identifier, standard = new Array(0)) => {
			let element;
			if(window['GM_getValue']) {
				element = window['GM_getValue'](identifier);
			} else {
				element = localStorage[identifier];
				if(!element) {
					G.s(identifier, standard);
					return standard;
				} else {
					return JSON.parse(element);
				}
			}
			if(element === null || element === undefined) {
				G.s(identifier, standard);
				return standard;
			}
			return element;
		},
		p: (identifier, value, standard = []) => {
			let ar = G.g(identifier, standard);
			ar.push(value);
			G.s(identifier, ar);
		},
		removeWhere: (identifier, filterFunction) => {
			let elements = G.g(identifier, []);
			elements = elements.filter(el => !filterFunction(el));
			G.s(identifier, elements);
			return elements;
		},
		filter: (identifier, filterFunction) => {
			let elements = G.g(identifier, []);
			elements = elements.filter(filterFunction);
			G.s(identifier, elements);
			return elements;
		},
		l: (name, fn, value1) => {
			function callfn(attribute, oldV, newV, remote) {
				if(value1) {
					fn(value1, attribute, oldV, newV, remote);
				}
				else {
					fn(attribute, oldV, newV, remote);
				}
				//fn : function(name, old_value, new_value, remote) {}
			}
			return window['GM_addValueChangeListener'](name, callfn);
		},
		//run:(filename, fnc)=> {
		//	this.s(this.sc.c.sI.GS.scriptcomm2, { mode: "getcode", file: filename, timestamp: new Date().valueOf(), url: location.href, fnc: fnc });
		//}
		toClipboard: (text, info = '') => {
			return window['GM_setClipboard'](text, info);
		},

		/**
	   * @param { String } identifier ""
	   * @param { String } key ""
	   * @param { any } value ""
	   * @param { any } standard ""
	   * @returns {any}
	   */
		setValue: (identifier, key, value, standard = {}) => {
			let obj = G.g(identifier, standard);
			obj[key] = value;
			G.s(identifier, obj);
		}
	};
	sc.G = G;
	return G;
}