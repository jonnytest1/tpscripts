/* global IMPORT,menu */


let buttonsfornextinstance = "nextbuttons";

find.a('linktable').then(async function watchSeriesEpisode() {

    await reqS("Storage/crossDomainStorage")

    sc.CD.s(buttonsfornextinstance, new Array(0));
    let nextButton = find.C("npbutton button-next");
    if (nextButton) {
        if (nextButton.length) {
            nextButton = nextButton[0];
        }
        sc.CD.p(buttonsfornextinstance, ["next", nextButton.href, location.href], new Array(0));
    }
    else {
        //await sc.S.Storage_crossDomainStorage.s("autoplay", false);
    }
    let previousButton = find.C("npbutton button-previous");
    debugger;
    if (previousButton) {
        if (previousButton.length) {
            previousButton = previousButton[0];
        }
        sc.CD.p(buttonsfornextinstance, ["previous", previousButton.href, location.href], new Array(0));
    }
    sc.CD.p(buttonsfornextinstance, [{ addVideoButtons: true }]);
    var parent = find.C("nextprev");
    if (!parent) {
        parent = find.C("channel-title");
    }
    if (parent.length) {
        parent = parent[0];
    }

    sc.menu.addToMenu({
        name: "autoplay",
        mouseOver: () => {
            sc.CD.s("autoplay", true);
            setlink();
        }
    });


    var btn = {};// parent.appendChild(document.createElement("a")); //find.C("npbutton button-next")[0].cloneNode(true)
    btn.innerText = "Autoplay";
    btn.className = "npbutton";

    // btn.style.backgroundImage = "http://static.mywatchseries.to/templates/default/images/hd.png";
    // btn.style.paddingLeft = "7px";
    //btn.style.paddingRight = "7px";


    if (sc.CD.g("autoplay", false) || location.hash.indexOf("autoplay") > -1) {
        //setlink();
    }
});

async function setlink() {
    let Videos_next = await reqS("Videos/next");
    debugger;
    history.pushState(null, document.title, location.href);
    //G.p(sc.c.sI.GS.eventstorage, { title: "watching series", body: document.title.replace("Watch Online ", "").replace(" - Watch Series", ""), host: "log", timeout: 10, url: location.href, iurl: "", fnc: null, timestamp: sc.T.n() });
    let container = sc.g("tbody");
    debugger;
    var excludedLinks = sc.CD.g("exclude", []);
    if (container) {
        //----------------------------------------------------------------------------------------
        let linkarray = [
            { link: "download_link_movpod.in ", priority: 55 },
            { link: "download_link_openload.co ", priority: 70 },
            { link: "download_link_powvideo.net ", priority: 80 }
        ]; //, "download_link_thevideo.me ""download_link_nowvideo.sx ",
        let sorted = linkarray.sort((p, a) => a.priority - p.priority);
        var opened = false;
        var list = [...container.children];
        let nextType;
        if (excludedLinks.length > 0) {
            debugger;
            let last = list.find(link => link.children[1].children[0].href == excludedLinks[excludedLinks.length - 1]);
            if (last) {
                nextType = linkarray.find(linkType => linkType.link != last.className);
                if (nextType) {
                    if (Videos_next(nextType, list, excludedLinks)) {
                        opened = true;
                    }
                }
            }
        }
        if (!opened) {
            for (let link of sorted) {
                if (Videos_next(link, list, excludedLinks)) {
                    opened = true;
                    break;
                }
                if (opened) {
                    break;
                }
            }
        }
        if (!opened) {
            if (list.length == 0) {
                alert('no videos found');
            }
            alert("no hoster linked");
        }
    }
    else {
        console.log("no links for this episode");
        try {
            location.href = find.C("npbutton button-next")[0].href;
        }
        catch (error) {
            //
        }
    }
}