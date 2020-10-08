/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var kissmangain = new EvalScript('', {
    async: true,
    run: async (resolv, set) => {

        let timer = await reqS('time');

        XMLHttpRequest.prototype.whitelisturl = [
            `(.*)${location.origin.replace('.', '\\.')
                .replace('?', '\\?')
                .replace(/\//g, '\\/')}(.*)`
        ];

        const subscribed = sc.G.g('kissmangainMangas');
        await timer.asyncForEach({
            array: Object.keys(subscribed),
            callback: async (key) => {

                const seenMangas = sc.G.filter('kissmangaSeenMangas',
                    StorageImplementation.filterDaysFunction(14, { keepLatest: true }),
                    { mapKey: key });

                if(!subscribed[key].shortKey || !subscribed[key].imageUrl || !subscribed[key].mangaName) {
                    const response = await fetch('/kissmanga/' + key);
                    const text = await response.text();

                    const container = new DOMParser().parseFromString(text, 'text/html');
                    /**
                     * @type {HTMLAnchorElement}
                     */
                    const shortLink = container.querySelector('link[rel=\'shortlink\']');
                    const url = new URL(shortLink.href);

                    const img = sc.g.eval('img', {
                        parent: container.querySelector('.summary_image'),
                        first: true
                    });
                    if(img) {
                        subscribed[key].imageUrl = img.src;
                    }
                    subscribed[key].mangaName = container.querySelector('h1').textContent
                        .trim();

                    subscribed[key].shortKey = url.searchParams.get('p');
                }

                let shortKey = subscribed[key].shortKey;

                const chapterRepsonse = await fetch('https://kissmanga.in/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: `action=manga_get_chapters&manga=${shortKey}`
                });
                const chapterHTML = await chapterRepsonse.text();
                const chapterDoc = new DOMParser().parseFromString(chapterHTML, 'text/html');

                /**
                 * @type {HTMLAnchorElement}
                 */
                let latestNotSeen;

                const chapters = sc.g.eval('li', {
                    parent: chapterDoc,
                    class: ['wp-manga-chapter']
                });

                let hasFoundSeenChapter = false;
                for(const chapter of chapters) {
                    const chapterLink = chapter.querySelector('a');
                    const chapterName = chapterLink.textContent.trim();
                    const chapterUrl = new URL(chapterLink.href);

                    const hasSeenChapter = seenMangas.some(seenLink => seenLink.value === chapterUrl.pathname);
                    hasFoundSeenChapter = hasFoundSeenChapter || hasSeenChapter;
                    const noSeenMangaStored = seenMangas.length === 0 && latestNotSeen;
                    if(hasSeenChapter || noSeenMangaStored) {
                        if(latestNotSeen) {
                            debugger;
                            sc.G.p('kissmangaSeenMangas', {
                                timestamp: Date.now(),
                                value: new URL(latestNotSeen.href).pathname
                            }, { mapKey: key });
                            const wnd = open(latestNotSeen.href);
                            GMnot(`new episode \n ${subscribed[key].mangaName}`, chapterName, subscribed[key].imageUrl, () => {
                                wnd.focus();
                            });
                            return null;
                        } else {
                            console.log(`already seen ${chapterName} from ${subscribed[key].mangaName}`);
                            return null;
                        }
                    } else {
                        latestNotSeen = chapterLink;
                    }
                }
                if(!hasFoundSeenChapter) {
                    const chapter = chapters[0];

                    const chapterLink = chapter.querySelector('a');
                    const chapterName = chapterLink.textContent.trim();

                    sc.G.p('kissmangaSeenMangas', {
                        timestamp: Date.now(),
                        value: new URL(chapterLink.href).pathname
                    }, { mapKey: key });
                    const wnd = open(chapterLink.href);
                    GMnot(`new episode \n ${subscribed[key].mangaName}`, chapterName, subscribed[key].imageUrl, () => {
                        wnd.focus();
                    });
                    debugger;
                }
                return null;
            }
        });

        sc.G.s('kissmangainMangas', subscribed);

    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
kissmangain;