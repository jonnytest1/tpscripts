/* global IMPORT,sc */
(async function cale() {
    let buttonsfornextinstance = 'nextbuttons';
    let crossDomainStorage = await reqS('Storage/crossDomainStorage');

    let t = sc.g.C('push_button blue');
    if (!t) {
        setTimeout(cale, 10);
    }
    sc.G.p('tempSS', { url: t.href, identifier: buttonsfornextinstance, content: crossDomainStorage.g(buttonsfornextinstance) }, []);
    sc.G.p('tempSS', { url: t.href, identifier: 'autoplay', content: crossDomainStorage.g('autoplay') }, []);
    location.href = t.href;

})();
