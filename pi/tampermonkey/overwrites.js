/* global evalError */
/// <reference path="./customTypes/index.d.ts"/>
/// <reference path="./customTypes/overwrites.d.ts" />
// tslint:disable: no-invalid-this
// eslint-disable-next-line no-unused-vars
function overwrites() {
	const openMethod = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function(...args) {
		this.requestUrl = args[1];
		return openMethod.call(this, ...args);
	};

	const send = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.send = function(...args) {
		try {
			if(this.whitelisturl && this.whitelisturl.length) {
				let matched = false;
				for(let matcher of this.whitelisturl) {
					const matches = this.requestUrl.match(matcher);
					if(matches && matches.length > 0) {
						matched = true;
					}
				}
				if(!matched) {
					logKibana('WARN', `urlwhitelist blocked request to ${this.requestUrl} at ${location.href}`);
					debugger;
					return;
				}
			}
			if(args[0]) {
				const orginalReadyStateChange = this.onreadystatechange;
				this.onreadystatechange = function(...eventsArgs) {
					if(this.readyState === 4) {
						const response = this.response;
						Object.defineProperty(this, 'response', {
							get: () => {
								return response;
							}
						});
					}
					if(orginalReadyStateChange) {
						orginalReadyStateChange.call(this, ...eventsArgs);
					}
				};
			}
		} catch(e) {
			logKibana('ERROR', `error intercepting request ${e}`, e);
		}
		send.call(this, ...args);

	};

	/**
	 * @type {{[key:string]:'same-origin'|true}}
	 */

	let staticlist = {
		'https://www.twitch.tv': true,
		'https://app.gotomeeting.com': true,
		'https://global.gotomeeting.com': true,
		'https://www.codingame.com': true,
		'https://www.amazon.de': true,
		'https://www.instagram.com': true,
		'https://www.muenchner-bank.de': true,
		'https://kissmanga.in': 'same-origin',
		'https://kissanime.ru': 'same-origin',
		'https://pi4.e6azumuvyiabvs9s.myfritz.net': true,
		'https://outlook.office.com': true,
		'https://www.youtube.com': true,
		'https://www1.swatchseries.to': 'same-origin',
		'https://www.lieferando.de/': true,
		'https://brandad.tpondemand.com/': true,
		'https://manganelo.com/': 'same-origin'
	};
	const setTimeoutBlacklist = [
		'loopIframe'
	];

	let originalSetTimeout = setTimeout;
	// @ts-ignore
	setTimeout = (fnc, ...args) => {
		if(fnc && fnc.name && setTimeoutBlacklist.includes(fnc.name)) {
			return;
		}
		return originalSetTimeout((...args2) => {
			try {
				fnc(...args2);
			} catch(e) {
				evalError(e);
			}
		}, ...args);
	};
	let originalsetInterval = setInterval;
	// @ts-ignore
	setInterval = (fnc, time, ...args) => {
		return originalsetInterval((...args2) => {
			try {
				fnc(...args2);
			} catch(e) {
				evalError(e);
			}
		}, time, ...args);
	};

	const urlBlacklist = [
		'https://vibtodo.com',
		'https://vid-to-do.com',
		'https://kissmanga.com',
		'https://kissanime.ru'
	];

	let openedWindows = {};

	function allowedToOpen(urlOrigin, urlWhitelist) {
		if(urlWhitelist[location.origin] || urlWhitelist[location.origin + '/']) {
			return true;
		}

		return Object.keys(urlWhitelist)
			.some(whitelistUrl => urlOrigin === whitelistUrl || urlOrigin + '/' === whitelistUrl);
	}

	let originalOpen = open;
	// @ts-ignore
	open = (url, target, featureFocus, ...args) => {
		const urlWhitelist = Object.assign(staticlist, sc.G.g('urlwhitelist', {}));
		/**
		 * @type {Window|WindowLike}
		 */
		let wind;
		if(target === true) {
			navigate(url);
			wind = window;
		} else {
			if(url.startsWith('/')) {
				url = location.origin + url;
			}
			const urlOrigin = getOrigin(url);

			if(allowedToOpen(urlOrigin, urlWhitelist)) {
				if(urlWhitelist[location.origin] === 'same-origin') {
					if(location.origin === urlOrigin || GM_openInTab.override) {
						logKibana('DEBUG', `opening site ${url} at ${location.href}`);
						wind = GM_openInTab(url, { active: false, insert: false });// originalOpen(url, target, featureFocus, ...args);
						GM_openInTab.override = false;
					}
				} else {
					logKibana('DEBUG', `opening site ${url} at ${location.href}`);
					wind = originalOpen(url, target, featureFocus, ...args);
				}

			} else if(featureFocus === true) {
				wind = originalOpen(url, target, featureFocus, ...args);
			} else if(url.startsWith('http')) {
				GMnot('blocked open', `${urlOrigin} on ${location.origin}`, '', () => {
					urlWhitelist[urlOrigin] = 'same-origin';
					let whitelsit = sc.G.g('urlwhitelist', {});
					whitelsit[urlOrigin] = 'same-origin';
					sc.G.s('urlwhitelist', whitelsit);
				});
				const windowMock = { location: {}, open: () => windowMock };
				return windowMock;
				let win = GM_openInTab(url, { active: false, insert: false }); //active ~focused insert: append at end or after the current tab
				win.name = window.name;
				if(win === undefined) {
					alert('didnt open tab :o');
				}
				wind = win;
			} else {
				if(urlBlacklist.includes(location.origin) || urlBlacklist.some(blacklistURl => urlOrigin === blacklistURl)) {
					wind = null;
				}
				GMnot('blocked open samesite', `${urlOrigin} on ${location.origin}`, '', () => {
					urlWhitelist[urlOrigin] = 'same-origin';
					let whitelsit = sc.G.g('urlwhitelist', {});
					whitelsit[urlOrigin] = 'same-origin';
					sc.G.s('urlwhitelist', whitelsit);
				});
				const not = new Notification(`blocked ${urlOrigin} on ${location.origin} `);
				not.onclick = () => {
					GM_setClipboard(location.origin);
				};
				// return originalOpen(url, target, featureFocus, ...args);
				throw `blocked ${urlOrigin} on ${location.origin} `;

			}
		}

		if(!wind) {
			return wind;
		}
		openedWindows[url] = wind;
		return wind;
	};

	GM_addValueChangeListener('urlChange', (name, oldvalue, newvalue, fromRemote) => {
		const wind = openedWindows[newvalue.old];
		if(newvalue && wind) {
			console.log(`changeing ${newvalue.old} to ${newvalue.new}`);
			openedWindows[newvalue.new] = wind;
			delete openedWindows[newvalue.old];
			GM_setValue('urlChange', null);
		}
	});

	const loc = window.location;
	/**
	 *
	 * @param {string} newUrl
	 */
	window.navigate = function navigate(newUrl) {
		const oldUrl = location.href;
		sc.G.s('urlChange', { old: oldUrl, new: newUrl });
		location.href = newUrl;
	};
	const overwriteLinks = [
		'kissmanga'
	];

	if(overwriteLinks.some(link => location.origin.includes(link))) {
		document.querySelectorAll('a')
			.forEach(link => link.addEventListener('click', e => navigate(link.href)));
	}

	GM_addValueChangeListener('close', (name, oldvalue, newvalue, fromremote) => {
		if(newvalue) {
			for(let i in openedWindows) {
				if(newvalue === i) {
					openedWindows[i].close();
				}
			}
			GM_setValue('close', null);
		}
	});

	let originalClose = close;
	window.close = () => {
		originalClose();
		GM_setValue('close', location.href);
		window.postMessage('close', window.location.origin);
	};

	/**
	 * @param {number} [millis]
	 */
	Promise.delayed = async (millis = 1) => {
		return new Promise(resolver => {
			setTimeout(resolver, millis);
		});
	};

	/*let originalAddEventListener = Element.prototype.addEventListener;
	Element.prototype.addEventListener = (a, b, ...rest) => {

		return originalAddEventListener(a, b, ...rest);

	}*/
	return {
		setTimeout: originalSetTimeout,
		open: originalOpen,
		setInterval: originalsetInterval
	};

	function getOrigin(url) {
		let urlOrigin;
		try {
			urlOrigin = new URL(url).origin;
		} catch(e) {
			// nvm
		}
		if(!urlOrigin) {
			urlOrigin = location.origin;
		}
		return urlOrigin;
	}
}