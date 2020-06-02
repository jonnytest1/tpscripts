///<reference path="../libs/eval-script.js" />
new EvalScript('', {
    run: async (res, set) => {
        const visitedColor = 'rgb(45, 115, 151)';
        const unvisitedColor = 'rgb(114, 206, 254)';

        const seenKey = 'kissmangaSeenMangas';
        const mangaName = location.pathname.split('Manga/')[1]
            .split('/')[0];
        function openLatestUnread() {
            /**
             * @type {NodeListOf<HTMLAnchorElement>}
             */
            const mangas = document.querySelectorAll('.listing tr a');

            const seen = sc.G.filter(seenKey, StorageImplementation.filterDaysFunction(21, { keepLatest: true }), { mapKey: mangaName });
            /**
             * @type {HTMLAnchorElement}
             */
            let latestNotSeen;
            for(const manga of [...mangas]) {
                const color = getComputedStyle(manga).color;

                if(color === visitedColor || manga.className === 'chapterVisited' || seen.some(seenLink => seenLink.value === new URL(manga.href).pathname)
                    || (seen.length === 0 && latestNotSeen)) {
                    if(latestNotSeen) {
                        if(location.search.includes('open=latest')) {
                            navigate(latestNotSeen.href);
                        } else {
                            console.log('would open' + latestNotSeen.href);
                        }

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
                    const nextButton = sc.g.eval('a', { text: 'Next chapter', first: true });
                    nextButton.click();
                } catch(err) {
                    //
                }
            })
        );
        if(location.search.includes('id')) {
            sc.G.p(seenKey, {
                timestamp: Date.now(),
                value: location.pathname
            }, { mapKey: mangaName });
            sc.menu.addToMenu({
                name: 'next',
                rotation: 0,
                mouseOver: (parnet, btn) => {
                    try {
                        const nextButton = sc.g.eval('a', { text: 'Next chapter', first: true });
                        if(!nextButton) {
                            btn.style.backgroundColor = 'red';
                            setTimeout(() => {
                                window.close();
                            }, 1000);
                        } else {
                            nextButton.click();
                        }
                    } catch(err) {
                        //
                    }
                },
                // lib: set.evalScript.getUrl()
            });
            sc.menu.addToMenu({
                name: 'previous',
                mouseOver: (parnet, btn) => {
                    try {
                        const nextButton = sc.g.eval('a', { text: 'Previous', first: true });
                        debugger;
                        if(!nextButton) {
                            btn.style.backgroundColor = 'red';
                        } else {
                            nextButton.click();
                        }
                    } catch(err) {
                        //
                    }
                },
                // lib: set.evalScript.getUrl()
            });
        } else {
            openLatestUnread();

        }
    }
});