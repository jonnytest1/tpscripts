/* global evalError */

// eslint-disable-next-line no-unused-vars
function overwrites() {
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

	let originalOpen = open;
	// @ts-ignore
	open = (url, target, featureFocus, ...args) => {
		if(target === true) {
			location.href = url;
			return window;
		}
		if(featureFocus === true) {
			return originalOpen(url, target, featureFocus, ...args);
		} else {
			// @ts-ignore
			let win = window.GM_openInTab(url, { active: false, insert: false }); //active ~focused insert: append at end or after the current tab
			win.name = window.name;
			if(win === undefined) {
				alert('didnt open tab :o');
			}
			return win;
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