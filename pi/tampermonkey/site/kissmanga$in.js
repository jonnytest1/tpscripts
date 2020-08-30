/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var kissmanga$in = new EvalScript('', {
    async: false,
    run: async (resolv, set) => {
        const menu = await reqS('DOM/CircularMenu');
        const links = [...document.querySelectorAll('a')]
            .filter(link => link.href.includes('/kissmanga/') && !link.href.includes('chapter'));
        links.forEach(link => {
            const identifier = link.href.split('kissmanga/')[1]
                .split('/')[0];

            const buttonDef = {
                name: sc.G.g('kissmangainMangas')[identifier] ? 'remove' : 'add',
                onclick: (e) => {
                    if(e.textContent === 'add') {
                        const mangas = sc.G.g('kissmangainMangas');
                        mangas[identifier] = {};
                        sc.G.s('kissmangainMangas', mangas);
                        buttonDef.name = 'remove';
                    } else {
                        const mangas = sc.G.g('kissmangainMangas');
                        mangas[identifier] = undefined;
                        sc.G.s('kissmangainMangas', mangas);
                        buttonDef.name = 'add';
                    }
                }
            };
            new menu(link, [buttonDef]);
        });

    },
    reset: (set) => {
        //
    }
});
// tslint:disable-next-line:no-unused-expression
kissmanga$in;