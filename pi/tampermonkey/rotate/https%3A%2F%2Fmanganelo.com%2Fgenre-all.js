/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var manganelocom = new EvalScript('', {
    waitForResolver: true,
    run: async (resolv, set) => {

        let timer = await reqS('time');

        const subscribed = sc.G.g('manganeloMangas');

        await timer.asyncForEach({
            array: Object.keys(subscribed),
            callback: async (manga) => {

                const seenMangas = sc.G.filter('manganeloSeenMangas',
                    StorageImplementation.filterDaysFunction(56, { keepLatest: true }),
                    { mapKey: manga });

                const siteRequest = await fetch(`https://manganelo.com/manga/${manga}`);
                const html = await siteRequest.text();

                const doc = new DOMParser().parseFromString(html, 'text/html');

                if(!subscribed[manga].imageUrl || !subscribed[manga].mangaName) {
                    const img = sc.g.eval('img', {
                        parent: doc.querySelector('.info-image'),
                        first: true
                    });
                    if(img) {
                        subscribed[manga].imageUrl = img.src;
                    }
                    subscribed[manga].mangaName = doc.querySelector('.story-info-right h1').textContent
                        .trim();
                }

                /**
                * @type {HTMLAnchorElement}
                */
                let latestNotSeen;

                const chapters = sc.g.eval('li', {
                    parent: doc.querySelector('.row-content-chapter'),
                });

                let hasFoundSeenChapter = false;
                for(const episode of chapters) {
                    const chapterLink = episode.querySelector('a');

                    const chapterUrl = new URL(chapterLink.href);

                    const hasSeenChapter = seenMangas.some(seenLink => seenLink.value === chapterUrl.pathname);

                    hasFoundSeenChapter = hasFoundSeenChapter || hasSeenChapter;
                    const noSeenMangaStored = seenMangas.length === 0 && latestNotSeen;
                    if(hasSeenChapter || noSeenMangaStored) {
                        if(latestNotSeen) {
                            debugger;
                            sc.G.p('manganeloSeenMangas', {
                                timestamp: Date.now(),
                                value: new URL(latestNotSeen.href).pathname
                            }, { mapKey: manga });
                            debugger;
                            const wnd = open(latestNotSeen.href);
                            GMnot(`new episode \n ${subscribed[manga].mangaName}`, latestNotSeen.textContent.trim(), subscribed[manga].imageUrl, () => {
                                wnd.focus();
                            });
                            return null;
                        } else {
                            const chapterName = chapterLink.textContent.trim();
                            console.log(`already seen ${chapterName} from ${subscribed[manga].mangaName}`);
                            return null;
                        }
                    } else {
                        latestNotSeen = chapterLink;
                    }

                }
                return null;
            }
        });
        sc.G.s('manganeloMangas', subscribed);
        sc.menu.elements.find(el => el.name === 'rotate').normalColor = 'Green';
    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
manganelocom;