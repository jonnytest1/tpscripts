///<reference path="../libs/eval-script.js" />
new EvalScript('', {
    run: async (res, set) => {
        const seenKey = 'kissmangaSeenMangas';
        const mangaName = location.pathname.split('kissmanga/')[1]
            .split('/')[0];
        const imgs = [...document.querySelectorAll('img.wp-manga-chapter-img')];
        imgs.forEach((el) =>
            el.addEventListener('click', () => {
                try {
                    const nextButton = sc.g.eval('a', { text: 'Next', first: true });
                    nextButton.click();
                } catch(err) {
                    //
                }
            })
        );
        if(location.pathname.includes('chapter')) {
            sc.G.filter(seenKey, StorageImplementation.filterDaysFunction(14, { keepLatest: true }), { mapKey: mangaName });
            sc.G.p(seenKey, {
                timestamp: Date.now(),
                value: location.pathname
            }, { mapKey: mangaName });
            sc.menu.addToMenu({
                name: 'next',
                rotation: 0,
                mouseOver: (parnet, btn) => {
                    try {
                        const nextButton = sc.g.eval('a', { text: 'Next', first: true, class: ['next_page'] });
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
                        const nextButton = sc.g.eval('a', { text: 'Prev', first: true, class: ['prev_page'] });
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

            /**
             * @type {NodeListOf<HTMLAnchorElement>}
             */
            const mangas = document.querySelectorAll('li.wp-manga-chapter a');

            const seen = sc.G.filter(seenKey, StorageImplementation.filterDaysFunction(21, { keepLatest: true }), { mapKey: mangaName });
            /**
             * @type {HTMLAnchorElement}
             */
            let latestNotSeen;
            for(const manga of [...mangas]) {
                const foundSeenManga = seen.some(seenLink => seenLink.value === new URL(manga.href).pathname);
                const noSeenMangaStored = seen.length === 0 && latestNotSeen;
                if(foundSeenManga || noSeenMangaStored) {
                    if(latestNotSeen) {
                        if(location.search.includes('open=latest')) {
                            sc.G.filter('kissmangaSeenMangas', StorageImplementation.filterDaysFunction(14, { keepLatest: true }), { mapKey: mangaName });
                            sc.G.p('kissmangaSeenMangas', {
                                timestamp: Date.now(),
                                value: new URL(latestNotSeen.href).pathname
                            }, { mapKey: mangaName });
                            navigate(latestNotSeen.href);
                        } else {
                            console.log('would open' + latestNotSeen.href);
                        }
                    } else {
                        manga.style.backgroundColor = 'green';
                    }
                    return;
                } else {
                    latestNotSeen = manga;
                }
            }
        }
    }
});