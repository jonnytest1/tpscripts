/// <reference path="../../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var manganelo$com = new EvalScript('', {
    async: true,
    run: async (resolv, set) => {

        reqS('DOM/CircularMenu')
            .then(menu => {
                const links = [...document.querySelectorAll('a')]
                    .filter(link => link.href.includes('/manga/'));
                links.forEach(link => {
                    const identifier = link.href.split('manga/')[1]
                        .split('/')[0];

                    const buttonDef = {
                        name: sc.G.g('manganeloMangas')[identifier] ? 'remove' : 'add',
                        onclick: (e) => {
                            if(e.textContent === 'add') {
                                const mangas = sc.G.g('manganeloMangas');
                                mangas[identifier] = {};
                                sc.G.s('manganeloMangas', mangas);
                                buttonDef.name = 'remove';
                            } else {
                                const mangas = sc.G.g('manganeloMangas');
                                mangas[identifier] = undefined;
                                sc.G.s('manganeloMangas', mangas);
                                buttonDef.name = 'add';
                            }
                        }
                    };
                    new menu(link, [buttonDef]);
                });
            });

        const seenKey = 'manganeloSeenMangas';
        if(!(location.href.split('manga').length === 2) && (location.pathname.split('/').length == 3)) {
            const mangaName = location.href.split('manga/')[1];

            const mangas = sc.g.eval('a', {
                class: ['chapter-name']
            });

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
                        if(location.hash.includes('open=latest')) {
                            sc.G.filter(seenKey, StorageImplementation.filterDaysFunction(14, { keepLatest: true }), { mapKey: mangaName });
                            sc.G.p(seenKey, {
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

        if(!(location.href.split('chapter').length === 2) && (location.pathname.split('/').length === 4)) {
            const mangaName = location.href.split('chapter/')[1]
                .split('/')[0];
            sc.G.p(seenKey, {
                timestamp: Date.now(),
                value: location.pathname
            }, { mapKey: mangaName });
            sc.menu.addToMenu({
                name: 'next',
                rotation: 0,
                mouseOver: (parnet, btn) => {
                    try {
                        const nextButton = sc.g.eval('a', { first: true, class: ['navi-change-chapter-btn-next'] });
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
                        const nextButton = sc.g.eval('a', { first: true, class: ['navi-change-chapter-btn-prev'] });
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
        }

    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
manganelo$com;