/* global IMPORT,sc */
(async function cale() {
    let buttonsfornextinstance = "nextbuttons";
    let Storage_crossDomainStorage = await reqS("Storage/crossDomainStorage")

    let t = find.C("push_button blue");
    if (!t) {
        setTimeout(cale, 10);
    }
    sc.G.p("tempSS", { url: t.href, identifier: buttonsfornextinstance, content: Storage_crossDomainStorage.g(buttonsfornextinstance) }, []);
    sc.G.p("tempSS", { url: t.href, identifier: "autoplay", content: Storage_crossDomainStorage.g("autoplay") }, []);
    location.href = t.href;

})();

