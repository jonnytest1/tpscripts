///<reference path="../libs/eval-script.js" />
new EvalScript('', {
    run: async (res, set) => {
        if(!location.pathname.includes('kissmanga/')) {
            return;
        }
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
            debugger;
            sc.G.filter('kissmangaSeenMangas', StorageImplementation.filterDaysFunction(56, { keepLatest: true }), { mapKey: mangaName });
            sc.G.p('kissmangaSeenMangas', {
                timestamp: Date.now(),
                value: location.pathname
            }, { mapKey: mangaName });
            let autoscroll = sc.G.g('autoscrollEnabled');
            sc.menu.addToMenu({
                name: 'autoscroll',
                mouseOver: (parnet, btn) => {
                    autoscroll = sc.G.s('autoscrollEnabled', !autoscroll);
                }
            });
            set.interval(() => {
                if(autoscroll) {
                    scrollBy({
                        left: 0,
                        top: 700,
                        behavior: 'auto'
                    });
                }
            }, 3500);

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

        }
    }
});