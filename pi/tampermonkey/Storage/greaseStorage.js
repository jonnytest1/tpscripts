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
		/**
		 * @param {import("../customTypes/storage").greasePushMapOptions} options
		 */
		p: (identifier, value, options = {}) => {
			options.default = options.default || [];
			if(options.mapKey) {
				options.default = {};
			}
			let storageObj = G.g(identifier, options.default);
			let ar = storageObj;
			if(options.mapKey) {
				if(ar[options.mapKey] === undefined) {
					ar[options.mapKey] = [];
				}
				ar = ar[options.mapKey];

			}
			ar.push(value);
			G.s(identifier, storageObj);
		},
		removeWhere: (identifier, filterFunction) => {
			let elements = G.g(identifier, []);
			elements = elements.filter(el => !filterFunction(el));
			G.s(identifier, elements);
			return elements;
		},
		/**
		 * @type {import("../customTypes/storage").greaseFilter}
		 * @param {import("../customTypes/storage").greaseFilterOptions} options
		 */
		filter: (identifier, filterFunction, options = {}) => {
			let elements = G.g(identifier, []);
			let array = elements;
			if(options.mapKey) {
				if(!elements[options.mapKey]) {
					elements[options.mapKey] = [];
				}
				array = elements[options.mapKey].filter(filterFunction);
			} else {
				array = elements.filter(filterFunction);
			}

			G.s(identifier, elements);
			return array;
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
		 * @type {import("../customTypes/storage").filterFunction}
		 */
		filterDaysFunction: (days) => {
			return el => el.timestamp < Date.now() - (1000 * 60 * 60 * 24 * days);
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