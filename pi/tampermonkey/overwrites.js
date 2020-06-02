/* global evalError */
/// <reference path="./customTypes/index.d.ts"/>
/// <reference path="./customTypes/overwrites.d.ts" />

// eslint-disable-next-line no-unused-vars
function overwrites() {

	const urlWhitelist = [
		'https://www.twitch.tv',
		'https://app.gotomeeting.com',
		'https://global.gotomeeting.com/',
		'https://www.codingame.com',
		'https://www.amazon.de/'
	];

	if(urlWhitelist.includes(location.origin)) {
		return;
	}

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

	let originalOpen = open;
	// @ts-ignore
	open = (url, target, featureFocus, ...args) => {

		debugger;
		/**
		 * @type {Window|WindowLike}
		 */
		let wind;
		if(target === true) {
			navigate(url);
			wind = window;
		} else {
			let urlOrigin;
			try {
				urlOrigin = new URL(url).origin;
			} catch(e) {
				// nvm
			}
			if(urlWhitelist.includes(location.origin) || urlWhitelist.some(whitelistUrl => urlOrigin === whitelistUrl)) {
				wind = originalOpen(url, target, featureFocus, ...args);
			} else if(featureFocus === true) {
				wind = originalOpen(url, target, featureFocus, ...args);
			} else if(url.startsWith('http')) {
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
				const not = new Notification(`blocked ${urlOrigin} on ${location.origin} `);
				not.onclick = () => {
					debugger;
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

	GM_addValueChangeListener('urlChange', (name, old_value, new_value, from_remote) => {
		const wind = openedWindows[new_value.old];
		if(new_value && wind) {
			console.log(`changeing ${new_value.old} to ${new_value.new}`);
			openedWindows[new_value.new] = wind;
			delete openedWindows[new_value.old];
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

	GM_addValueChangeListener('close', (name, old_value, new_value, from_remote) => {
		if(new_value) {
			for(let i in openedWindows) {
				if(new_value === i) {
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
	 * @param {number} [amount]
	 */
	Promise.delayed = async (amount = 1) => {
		return new Promise(resolver => {
			setTimeout(resolver, amount);
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
}