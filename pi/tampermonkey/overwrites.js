/* global evalError */
/// <reference path="./customTypes/index.d.ts"/>
// eslint-disable-next-line no-unused-vars
function overwrites() {


	const urlWhitelist = [
		'https://www.twitch.tv',
		'https://app.gotomeeting.com',
		'https://global.gotomeeting.com/'
	];

	if(urlWhitelist.includes(location.origin)) {
		return;
	}

	let originalSetTimeout = setTimeout;
	// @ts-ignore
	setTimeout = (fnc, ...args) => {
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
		'https://vid-to-do.com'
	];

	let originalOpen = open;
	// @ts-ignore
	open = (url, target, featureFocus, ...args) => {

		debugger;

		if(target === true) {
			location.href = url;
			return window;
		}
		let urlOrigin;
		try {
			urlOrigin = new URL(url).origin;
		} catch(e) {
			// nvm
		}
		debugger;
		if(urlWhitelist.includes(location.origin) || urlWhitelist.some(whitelistUrl => urlOrigin === whitelistUrl)) {
			return originalOpen(url, target, featureFocus, ...args);
		}

		if(featureFocus === true) {
			return originalOpen(url, target, featureFocus, ...args);
		} else if(url.startsWith('http')) {
			debugger;
			// @ts-ignore
			let win = window.GM_openInTab(url, { active: false, insert: false }); //active ~focused insert: append at end or after the current tab
			win.name = window.name;
			if(win === undefined) {
				alert('didnt open tab :o');
			}
			return win;
		} else {
			if(urlBlacklist.includes(location.origin) || urlBlacklist.some(blacklistURl => urlOrigin === blacklistURl)) {
				return null;
			}
			const not = new Notification(`blocked ${urlOrigin} on ${location.origin} `);
			not.onclick = () => {
				debugger;
			};
			// return originalOpen(url, target, featureFocus, ...args);
			throw `blocked ${urlOrigin} on ${location.origin} `;

		}
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