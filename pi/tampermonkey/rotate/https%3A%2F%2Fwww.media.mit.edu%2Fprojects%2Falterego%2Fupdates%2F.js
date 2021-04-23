/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../notification.js" />

/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {EvalScript<{},unknown>}
 */
var mediamit = new EvalScript('', {
    waitForResolver: true,
    run: async (resolv, set) => {
        const htmlUrl = new URL(set.evalScript.getSiteFilter());

        setTimeout(async function MIT() {

            const htmlResponse = await fetch(htmlUrl.href);
            const html = await htmlResponse.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            let previousLink = sc.G.g('mitAlterEgoLastLink', '');

            let firstModule = doc.querySelectorAll('.container-item')[0];
            let moduleLink = sc.g.eval('a', {
                parent: firstModule, class: ['module-content-guard'],
                first: true
            }).href;
            const moduleLinkUrl = new URL(moduleLink);
            moduleLinkUrl.host = htmlUrl.host;
            if(moduleLinkUrl.href !== previousLink) {
                debugger;
                GMnot('new mit', sc.g.eval('h2', {
                    class: ['module-title'],
                    parent: firstModule,
                    first: true
                }).textContent);
                sc.G.s('mitAlterEgoLastLink', moduleLinkUrl.href);
            }
        }, 2000);
    },
    reset: (set) => {
        //
    }
});
//tslint:disable-next-line
mediamit;