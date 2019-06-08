/*global sc,DOM_CircularMenu */

let links = sc.g("a");
if (links) {
    const tvshows = "followedtvshows"
    for (let link of links) {
        if (link.href && link.href.indexOf("/serie/") > -1) {
            new CircularMenu(link, [
                {
                    name: "add",
                    onclick: function (btn) {
                        sc.G.p(tvshows, { name: btn.target.href.split("serie/")[1].split("-")[0], ts: new Date().valueOf() }, []);
                    },
                    isValid: function (btn) {
                        let followedShows = sc.G.g(tvshows, []);
                        return !followedShows.some(el => el.name == btn.href.split("serie/")[1].split("-")[0]);
                    }
                }, {
                    name: "remove",
                    enabledColor: "red",
                    onclick: function (btn) {
                        let link = btn.target.href.split("serie/")[1].split("-")[0];
                        debugger;
                        sc.G.remove(tvshows, (obj) => obj.name == link);
                    },
                    isValid: function (btn) {
                        let followedShows = sc.G.g(tvshows, []);
                        return followedShows.some(el => el.name == btn.href.split("serie/")[1].split("-")[0]);
                    }
                }
            ]);
        }
    }
}