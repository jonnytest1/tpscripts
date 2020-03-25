///<reference path="../libs/eval-script.js" />
new EvalScript('', {
    run: async (res, set) => {
        const visitedColor = 'rgb(45, 115, 151)';
        const unvisitedColor = 'rgb(114, 206, 254)';

        const seenKey = 'kissmangaSeenMangas';
        const mangaName = location.pathname.split('Manga/')[1];
        function openLatestUnread() {
            /**
             * @type {NodeListOf<HTMLAnchorElement>}
             */
            const mangas = document.querySelectorAll('.listing tr a');

            const seen = sc.G.g(seenKey, {})[mangaName] || [];
            /**
             * @type {HTMLAnchorElement}
             */
            let latestNotSeen;
            for(const manga of [...mangas]) {
                debugger;
                const color = getComputedStyle(manga).color;

                if(color === visitedColor || manga.className === 'chapterVisited' || seen.includes(new URL(manga.href).pathname)
                    || (seen.length === 0 && latestNotSeen)) {
                    if(latestNotSeen) {
                        location.href = latestNotSeen.href;
                    } else {
                        manga.style.backgroundColor = 'red';
                    }
                    return;
                } else if(color === unvisitedColor) {
                    latestNotSeen = manga;
                }
            }
        }
        const imgs = [...document.querySelectorAll('#divImage img')];
        imgs.forEach((el) =>
            el.addEventListener('click', () => {
                try {
                    /**@type {HTMLElement} */
                    const nextButton = document.querySelector('.btnNext');
                    nextButton.click();
                } catch(err) {
                    //
                }
            })
        );
        if(location.search.includes('id')) {
            sc.G.p(seenKey, location.pathname, { mapKey: mangaName });
            sc.menu.addToMenu({
                name: 'next',
                mouseOver: (parnet, btn) => {
                    try {
                        /**@type {HTMLElement} */
                        const nextButton = document.querySelector('.btnNext');
                        if(!nextButton) {
                            btn.style.backgroundColor = 'red';
                        } else {
                            nextButton.click();
                        }
                    } catch(err) {
                        //
                    }
                },
                lib: set.evalScript.getUrl()
            });
        } else {
            if(location.search.includes('open=latest')) {
                openLatestUnread();
            }
        }
    }
});