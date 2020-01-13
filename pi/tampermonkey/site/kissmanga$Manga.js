///<reference path="../libs/eval-script.js" />
new EvalScript('', {
    run: async (res, set) => {
        const visitedColor = 'rgb(45, 115, 151)';
        const unvisitedColor = 'rgb(114, 206, 254)';

        function openLatestUnread() {
            /**
             * @type {NodeListOf<HTMLAnchorElement>}
             */
            const mangas = document.querySelectorAll('.listing tr a');

            /**
             * @type {HTMLAnchorElement}
             */
            let latestNotSeen;
            for(const manga of [...mangas]) {
                const color = getComputedStyle(manga).color;

                if(color === visitedColor) {
                    if(latestNotSeen) {
                        location.href = latestNotSeen.href;
                        break;
                    }
                } else if(color === unvisitedColor) {
                    latestNotSeen = manga;
                }
            }
        }

        const imgs = [...document.querySelectorAll('#divImage img')];

        imgs.forEach((el) =>
            el.addEventListener('click', () => {
                try {
                    /**@type HTMLElement */
                    const nextButton = document.querySelector('.btnNext');
                    nextButton.click();
                } catch(err) {
                    //
                }
            })
        );
        if(location.search.includes('id')) {
            sc.menu.addToMenu({
                name: 'next',
                mouseOver: () => {
                    try {
                        /**@type HTMLElement */
                        const nextButton = document.querySelector('.btnNext');
                        nextButton.click();
                    } catch(err) {
                        //
                    }
                }
            });
        } else {
            if(location.search.includes('open=latest')) {
                openLatestUnread();
            }
        }
    },
    reset: () => {
        sc.menu.removeByName('next');
    }
});