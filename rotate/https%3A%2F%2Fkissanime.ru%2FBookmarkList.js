/* global IMPORT,crIF*/

(async function kissAnimeBookmarkList() {


    await reqS("DOM/iframe");

    await reqS("notification");

    await reqS("http");


    if (document.getElementsByTagName("body")[0].innerHTML === "The service is unavailable." || document.body.innerHTML === "KissAnime closed to fix some serious issues. Please wait.") {
        location.reload();
        return;
    }


    let animeListParent = document.getElementsByClassName("listing")[0];
    if (animeListParent === undefined) {
        setTimeout(kissAnimeBookmarkList, 500);
        return;
    }
    var animeContainer = animeListParent.children[0];

    http("GET", location.href, function (html) {


        //sort
        let list = animeContainer.children;
        let currentSeasonCounter = 2;
        let currentUnwatchedCounter = 2;
        for (let ind = 2; ind < list.length; ind++) {
            let latest = list[ind].children[1].innerText.trim();
            let watchStatus = list[ind].children[2].innerText.trim();

            if (latest !== "Completed" && latest !== "Not yet aired") {
                if (watchStatus === "Unwatched") {
                    animeContainer.insertBefore(list[ind], animeContainer.children[currentUnwatchedCounter++]);
                    currentSeasonCounter++;
                } else {
                    animeContainer.insertBefore(list[ind], animeContainer.children[currentSeasonCounter++]);
                }
            }
        }

        //get image for anime array
        var ar = html.split("<td title='");
        ar.shift();
        ar.map((imageElement) => imageElement.split("</a>")[0]);

        //iterate through animes and open
        let preferedHoster = "beta";

        function getUrl(currentEpisode) {
            let episodeUrl = currentEpisode.children[1].children[0].href;
            let url = episodeUrl;
            let hosterUrlAddOn = "&s=" + preferedHoster;
            if (url.indexOf("&s=") === -1) {
                return url + hosterUrlAddOn;
            } else {
                return url.replace("&s=default", hosterUrlAddOn);
            }

        }
        function markWatched(episode) {
            if (episode.children[1]) {
                episode.children[1].click();
            }
            episode.outerText = "Watched";
        }
        (function iterate(ind, list, ar) {
            if (ind < list.length) {
                let currentEpisode = list[ind];
                let animeName = currentEpisode.children[0];
                let animeText = animeName.innerText.trim();
                let animeStatus = currentEpisode.children[1].innerText.trim();
                let watchedStatus = currentEpisode.children[2];
                if (watchedStatus.innerText.trim() === "Unwatched") {
                    if (animeStatus === "Not yet aired") {
                        markWatched(watchedStatus);
                    } else if (animeStatus !== "Completed") {

                        let iconUrl = ar.find((ele) => ele.includes(animeText)).split("src=\"")[1].split("\" ")[0];
                        GMnot("Anime: " + animeText, animeStatus, iconUrl);
                        open(getUrl(currentEpisode));
                        markWatched(watchedStatus);
                        // eslint-disable-next-line
                    } else if (prcompleted.f(animeText) === -1) {
                        //get url of latest episode
                        crIF(document.body, animeName.children[0].href, function (frame, vars) {
                            let array = find("tbody", frame.contentDocument).children;
                            let url = array[2].children[0].children[0].href;
                            let iconurl = find("rightBox", frame.contentDocument)[0].children[1].children[1].children[0].src;
                            GMnot(vars.title, iconurl, array[2].children[0].children[0].innerText, null, url);
                            open(url);
                            frame.remove();
                        }, true, {
                                title: animeText
                            });
                        markWatched(watchedStatus);
                    }
                    setTimeout(iterate, 500, ind + 1, list, ar); // iterate(ind+1,list);
                }
            }
        })(2, list, ar);
    }, undefined, undefined, false);
})();