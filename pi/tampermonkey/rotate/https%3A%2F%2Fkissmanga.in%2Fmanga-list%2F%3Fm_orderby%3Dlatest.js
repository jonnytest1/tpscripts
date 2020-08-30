/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var kissmangain = new EvalScript('', {
    async: true,
    run: async (resolv, set) => {
        let lastSubscribedFound = sc.G.g('kissmangainlatest', '');
        const seenMangas = sc.G.g('kissmangaSeenMangas');
        const subscribed = sc.G.g('kissmangainMangas');
        let index = 1;
        let done = false;
        let hasSetLatest = false;
        while(!done) {
            const siteRequest = await fetch(`https://kissmanga.in/manga-list/page/${index++}/?m_orderby=latest`);
            const html = await siteRequest.text();

            const element = document.createElement('htmltree');
            element.innerHTML = html;
            const mangas = element.querySelectorAll('.page-item-detail');

            for(let manga of mangas) {
                const titleLink = manga.querySelector('a');
                const mangaIdentifier = titleLink.href.split('kissmanga/')[1]
                    .replace('/', '');
                let mangaViews = seenMangas[mangaIdentifier] || [];
                if(!hasSetLatest) {
                    sc.G.s('kissmangainlatest', mangaIdentifier);
                    hasSetLatest = true;
                }
                if(subscribed[mangaIdentifier]) {
                    if(lastSubscribedFound === mangaIdentifier) {
                        done = true;
                    }
                    const chapters = manga.querySelectorAll('.chapter-item ');
                    for(let chapter of chapters) {
                        const timeText = chapter.querySelector('.post-on');
                        const chapterLink = chapter.querySelector('a');
                        const chapterLinkPath = new URL(chapterLink.href).pathname;

                        const timeContent = timeText.textContent.trim();
                        const inTimeRange = timeContent.includes(' second') || timeContent.includes(' min') || timeContent.includes(' hour');
                        const seenChapter = mangaViews.some(mangaView => mangaView.value === chapterLinkPath);
                        if(inTimeRange && subscribed[mangaIdentifier].lastEpisode !== chapterLink.href && !seenChapter) {
                            const wnd = open(titleLink.href + '?open=latest');
                            GMnot(`new episode \n ${mangaIdentifier}`, chapterLink.textContent, manga.querySelector('img').src, () => {
                                wnd.focus();
                            });
                            subscribed[mangaIdentifier].lastEpisode = chapterLink.href;
                            break;
                        }
                    }
                }
            }
        }
        sc.G.s('kissmangainMangas', subscribed);
    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
kissmangain;