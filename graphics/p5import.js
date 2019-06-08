// eslint-disable-next-line no-unused-vars

document.currentScript.isAsync = true;
const p5Import = document.currentScript;
(async () => {

    let ct = 0;
    await reqS("graphics/p5addon");

    await req("https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/p5.js")


    // req("https://raw.githubusercontent.com/lmccart/p5.js/master/lib/addons/p5.dom.js").then(() => ct++);

    finished(undefined, true, p5Import);
})();

