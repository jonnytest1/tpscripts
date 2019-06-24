/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../http.js" />
/// <reference path="../notification.js" />
(async () => {

    let lib = await reqS('http');

    await reqS('notification');

    document.title = document.title.replace('Read manga', '');

    function bookmarkcheck(url) {
        var ar = url.split('<td title=\'');
        const list = sc.g.C('listing')
            .querySelectorAll('tr');
        for (var i = 2; i < list.length; i++) {

            const readStatus = [...list[i].children[2].querySelectorAll('a')].filter(
                a => a.style.display !== 'none')[0].textContent
                .trim();

            const comicGroupLink = list[i].children[0].querySelector('a');
            const comicEpisodeLink = list[i].children[1].querySelector('a');

            if (readStatus === 'Read') {
                break;
            }
            else {
                for (var j = 1; j < ar.length; j++) {
                    const episodeLink = ar[j].split('href="/Comic/')[1]
                        .split('">')[0];
                    var t1 = `${location.origin}/Comic/${episodeLink}`;
                    if (t1 === comicGroupLink.href) {
                        url = ar[j].split('src="')[1]
                            .split('" style=')[0];
                        break;
                    }
                }
                let status = list[i].children[1].textContent.trim();
                let openurl;
                if (status === 'Completed') {
                    openurl = comicGroupLink.href;
                }
                else {
                    openurl = comicEpisodeLink.href;
                }
                debugger;
                GMnot('Manga: ' + list[i].children[0].textContent.trim(), list[i].children[1].textContent.trim(), url, undefined, openurl);

                const watchLink = [...list[i].children[2].querySelectorAll('a')]
                    .filter(a => a.className === 'aUnRead')[0];
                watchLink.click();
                open(openurl);
            }
        }
    }
    lib.http('GET', location.href, bookmarkcheck);
})();