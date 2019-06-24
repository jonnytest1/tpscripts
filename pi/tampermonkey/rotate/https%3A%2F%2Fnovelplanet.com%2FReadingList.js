///<reference path="../customTypes/index.d.ts"/>
///<reference path="../notification.js"/>
//handleError(new Error('missing'));

new EvalScript('', {
    run: async () => {
        const recentNovelsString = 'novelplanet';
        let novels = document.querySelectorAll('.aRecordReading');
        let recentNovels = sc.G.g(recentNovelsString, {});
        for (let novel of novels) {
            let name = novel.querySelector('.title').textContent;
            /**@type {HTMLLinkElement} */
            let newest = novel.querySelector('a.button.alt.small');
            let title = newest.textContent.split('\n')[0];
            if (recentNovels[name]) {
                if (recentNovels[name] !== title) {
                    GMnot(name, title, novel.querySelector('img').src, undefined, newest.href);
                    open(newest.href);
                    recentNovels[name] = title;
                }
            } else {
                recentNovels[name] = title;
            }
        }
        sc.G.s(recentNovelsString, recentNovels);
    }
});
