/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var manganelocom = new EvalScript('', {
    waitForResolver: true,
    run: async (resolv, set) => {
        let lastSubscribedFound = sc.G.g('manganelolatest', '');
        const seenMangas = sc.G.g('manganeloSeenMangas');
        const subscribed = sc.G.g('manganeloMangas');
        let index = 1;
        let done = false;
        let hasSetLatest = false;
        let counter = 0;
        while(!done && counter++ < 10) {
            const siteRequest = await fetch(`https://manganelo.com/genre-all/${index++}`);
            const html = await siteRequest.text();

            const element = new DOMParser().parseFromString(html, 'text/html');
            const mangas = element.querySelectorAll('.content-genres-item');

            for(let manga of mangas) {
                const titleLink = manga.querySelector('a');
                const mangaIdentifier = titleLink.href.split('manga/')[1]
                    .replace('/', '');
                let mangaViews = seenMangas[mangaIdentifier] || [];
                if(subscribed[mangaIdentifier]) {
                    if(!hasSetLatest) {
                        sc.G.s('manganelolatest', mangaIdentifier);
                        hasSetLatest = true;
                    }
                    if(lastSubscribedFound === mangaIdentifier) {
                        done = true;
                    }
                    /**
                     * @type {HTMLAnchorElement}
                     */
                    const chapter = manga.querySelector('.genres-item-chap');
                    const chapterLink = chapter.href;
                    const chapterLinkPath = new URL(chapterLink).pathname;
                    const displayName = manga.querySelector('h3')
                        .querySelector('a').title;
                    const seenChapter = mangaViews.some(mangaView => mangaView.value === chapterLinkPath);
                    if(subscribed[mangaIdentifier].lastEpisode !== chapterLink && !seenChapter) {
                        const wnd = open(titleLink.href + '#open=latest');
                        GMnot(`new episode \n ${displayName}`, chapter.textContent, manga.querySelector('img').src, () => {
                            wnd.focus();
                        });
                        subscribed[mangaIdentifier].lastEpisode = chapterLink;
                    }

                }
            }
        }
        sc.G.s('manganeloMangas', subscribed);

    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
manganelocom;