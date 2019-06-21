/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../notification.js" />

let greaseKey = 'mitAlterEgoLastLink';

setTimeout(function MIT() {
    let previousLink = sc.G.g(greaseKey, '');

    let firstModule = sc.g('container-item')[0];
    let moduleLink = sc.g('module-content-guard', firstModule).href;
    if (moduleLink !== previousLink) {
        GMnot('new mit', sc.g('module-title', firstModule).textContent);
        sc.G.s(greaseKey, moduleLink);
    }
}, 2000);