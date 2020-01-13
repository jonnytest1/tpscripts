/* global IMPORT */
// eslint-disable-next-line no-unused-vars
/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../notification.js" />
/// <reference path="../http.js" />

(async function kissmanga() {
    let http = await reqS('http');

    document.title = document.title.replace('Read manga', '');

    http.http('GET', location.href, html => {
        var ar = html.split('<td title=\'');
        var list = document.getElementsByClassName('listing')[0].children[0].children;
        for(var i = 2; i < list.length; i++) {
            /**@type any */
            let element = list[i];
            let readStatus = [...element.children[2].children].filter((a) => a.style.display !== 'none')[0].textContent
                .trim();
            if(readStatus === 'Read') {
                break;
            }
            else {
                let iconUrl;
                for(var j = 1; j < ar.length; j++) {
                    var t1 = `${location.origin}/Manga/${ar[j].split('href="/Manga/')[1]
                        .split('">')[0]}`;
                    if(t1 === element.children[0].children[0].href) {
                        iconUrl = ar[j].split('src="')[1]
                            .split('" style=')[0];
                        break;
                    }
                }
                let status = element.children[1].textContent.trim();
                let openurl = element.children[0].children[0].href;
                openurl += '?open=latest';
                GMnot('Manga: ' + element.children[0].textContent.trim(), element.children[1].textContent.trim(), iconUrl, undefined, openurl);
                element.children[2].children[1].click();
                open(openurl);
            }
        }
    });
})();