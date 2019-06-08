/* global Storage_greaseStorage,notification*/


let greaseKey = 'mitAlterEgoLastLink';

setTimeout(function MIT() {
    let previousLink = Storage_greaseStorage.g(greaseKey, "");

    let firstModule = find("container-item")[0];
    let moduleLink = find("module-content-guard", firstModule).href;
    if (moduleLink !== previousLink) {
        notification("new mit", find("module-title", firstModule).textContent);
        Storage_greaseStorage.s(greaseKey, moduleLink);
    }
}, 2000);