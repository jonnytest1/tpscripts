/*global IMPORT,notification */
/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../notification.js" />
(async function tvschedule() {

    let ewatchopenedvideos = "openedvideos";

    function getDate() {
        let t = new Date().toString().split(" ");
        let datestring = t[0] + ", " + t[1] + " " + t[2];
        return datestring;
    }
    await sc.g.a("slick-track");
    let days = await find.a("slick-slide");
    let today = [...days].find(d => find("tabs", d).innerText == "Today");
    if (today) {
        //followed series
        let followed = Storage_greaseStorage.g("followedtvshows", []);
        //already opened series
        let opnd = Storage_greaseStorage.filter(ewatchopenedvideos, el => el.time + 1000 * 60 * 60 * 24 * 6 >= new Date().valueOf());
        //new series
        let yesterday = [...days].findIndex(el => el == today) - 1;
        //recently added complete series
        let recentNew = Storage_greaseStorage.g('recentNewSeries', []);
        recentNew = recentNew.filter(e => e.timestamp > new Date().valueOf() - 1000 * 60 * 60 * 24 * 14);
        //!!!going minus
        for (let m = yesterday; m >= 0; m--) {
            let day = days[m];
            let showsCount = {};
            let shows = find("listings", day).children;
            for (let i = 0; i < shows.length; i++) {
                let link = shows[i].children[1].href;
                let seriesName = shows[i].children[1].children[0].textContent;
                if (showsCount[seriesName]) {
                    showsCount[seriesName]++;
                    if (showsCount[seriesName] == 5 && !recentNew.some(r => r.name == seriesName)) {
                        GMnot(location.host + " new series " + seriesName);
                        recentNew.push({ name: seriesName, timestamp: new Date().valueOf() });
                    }
                }
                else {
                    showsCount[seriesName] = 1;
                }
                if (link.indexOf("serie/") > -1) {
                    //new episode isnt added yet
                    let text = link.split("serie/")[1].split("-")[0];
                    let episodeStrings = shows[i].children[1].textContent.split("\n")[1].split(" Episode ");
                    let episode = "S" + episodeStrings[0].replace("Season ", "") + "E" + episodeStrings[1];
                    if (followed.find((followedElement) => followedElement.name == text)) {
                        let url = find("b", shows[i]).parentElement.href;
                        if (!opnd.find((opend) => opend.url == url)) {
                            open(url + "#open=1&ep=" + episode);
                            Storage_greaseStorage.p(ewatchopenedvideos, {
                                url: url,
                                time: new Date().valueOf()
                            });
                        }
                    }
                }
                else {
                    //new episode is added
                    let text = link.split("episode/")[1];
                    if (followed.find((followedElement) => text.includes(followedElement.name))) {
                        let url = find("b", shows[i]).parentElement.href;
                        if (!opnd.find((opend) => opend.url == url)) {
                            Storage_greaseStorage.p(ewatchopenedvideos, {
                                url: url,
                                time: new Date().valueOf()
                            });
                            open(url + "#autoplay=1");
                        }
                    }
                }
            }
        }
        Storage_greaseStorage.s('recentNewSeries', recentNew);
        setTimeout(function () {
            location.reload();
        }, 1000 * 60 * 60 * 12);
    } else {
        setTimeout(tvschedule, 1000);
    }

    try {
        find("modal-backdrop").remove();
    } catch (e) {
        //
    }
})();