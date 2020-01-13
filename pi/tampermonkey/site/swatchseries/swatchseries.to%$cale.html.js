/// <reference path="../../customTypes/index.d.ts" />

new EvalScript('', {
    run: async function cale() {
        let buttonsfornextinstance = 'nextbuttons';
        let crossDomainStorage = await reqS('Storage/crossDomainStorage');

        let t = await sc.g.a('push_button blue');
        if(!t) {
            setTimeout(cale, 10);
        }
        sc.G.p('tempSS', { url: t.href, identifier: buttonsfornextinstance, content: crossDomainStorage.g(buttonsfornextinstance, undefined) }, []);
        sc.G.p('tempSS', { url: t.href, identifier: 'autoplay', content: crossDomainStorage.g('autoplay', undefined) }, []);

        if(t.href) {
            location.href = t.href;
        }
        //
    }
});