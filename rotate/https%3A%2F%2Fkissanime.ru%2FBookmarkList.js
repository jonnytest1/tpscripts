/// <reference path="../notification.js" />
/// <reference path="../DOM/iframe.js" />
new EvalScript('', {
    run: async function animeBookmark(resolv, set, lib) {
        if (document.getElementsByTagName('body')[0].innerHTML === 'The service is unavailable.' ||
            document.body.innerHTML === 'KissAnime closed to fix some serious issues. Please wait.') {
            location.reload();
            return;
        }

        let animeListParent = document.getElementsByClassName('listing')[0];
        if (animeListParent === undefined) {
            setTimeout(animeBookmark, 500, resolv, set, lib);
            return;
        }
        var animeContainer = animeListParent.children[0];

        (await reqS('http')).http('GET', location.href, html => {

            //sort
            let list = animeContainer.children;
            let currentSeasonCounter = 2;
            let currentUnwatchedCounter = 2;
            for (let ind = 2; ind < list.length; ind++) {
                let currentSeries = list[ind];

                /**@type {HTMLElement} */
                const statusElement = currentSeries.querySelector('td:nth-child(2)');
                let status = statusElement.innerText.trim();

                /**@type {HTMLElement} */
                const watchedElement = currentSeries.querySelector('td:nth-child(3)');
                let watchStatus = watchedElement.innerText.trim();

                if (status !== 'Completed' && status !== 'Not yet aired') {
                    if (watchStatus === 'Unwatched') {
                        animeContainer.insertBefore(currentSeries, animeContainer.children[currentUnwatchedCounter++]);
                        currentSeasonCounter++;
                    } else {
                        animeContainer.insertBefore(currentSeries, animeContainer.children[currentSeasonCounter++]);
                    }
                }
            }

            //get image for anime array
            var ar = html.split('<td title=\'');
            ar.shift();
            ar.map((imageElement) => imageElement.split('</a>')[0]);

            let preferedHoster = 'beta';

            function getUrl(currentEpisode) {
                let episodeUrl = currentEpisode.children[1].children[0].href;
                let url = episodeUrl;
                let hosterUrlAddOn = '&s=' + preferedHoster;
                if (url.indexOf('&s=') === -1) {
                    return url + hosterUrlAddOn;
                } else {
                    return url.replace('&s=default', hosterUrlAddOn);
                }

            }
            function markWatched(episode) {
                if (episode.children[1]) {
                    episode.children[1].click();
                }
                episode.outerText = 'Watched';
            }
            (function iterate(ind, animeList, iconArray) {
                if (ind < animeList.length) {
                    let currentEpisode = animeList[ind];
                    let animeName = currentEpisode.children[0];

                    /**@type {HTMLElement} */
                    const nameElement = currentEpisode.querySelector('td:nth-child(1)');
                    let animeText = nameElement.innerText;

                    /**@type {HTMLElement} */
                    const statusElement = currentEpisode.querySelector('td:nth-child(2)');
                    let animeStatus = statusElement.innerText.trim();

                    /**@type {HTMLElement} */
                    const watchedStatus = currentEpisode.querySelector('td:nth-child(3)');

                    if (watchedStatus.innerText.trim() === 'Unwatched') {
                        if (animeStatus === 'Not yet aired') {
                            markWatched(watchedStatus);
                        } else if (animeStatus !== 'Completed') {

                            let iconUrl = iconArray.find((ele) => ele.includes(animeText))
                                .split('src="')[1]
                                .split('" ')[0];
                            GMnot('Anime: ' + animeText, animeStatus, iconUrl);
                            open(getUrl(currentEpisode));
                            markWatched(watchedStatus);
                            // eslint-disable-next-line
                        } /*else if (prcompleted.f(animeText) === -1) {
                        //get url of latest episode
                        crIF(document.body, animeName.children[0].href, function (frame, vars) {
                            let array = sc.g('tbody', frame.contentDocument).children;
                            let url = array[2].children[0].children[0].href;
                            let iconurl = sc.g('rightBox', frame.contentDocument)[0].children[1].children[1].children[0].src;
                            GMnot(vars.title, iconurl, array[2].children[0].children[0].innerText, null, url);
                            open(url);
                            frame.remove();
                        }, true, {
                                title: animeText
                            });
                        markWatched(watchedStatus);
                    }*/
                        setTimeout(iterate, 500, ind + 1, animeList, iconArray); // iterate(ind+1,list);
                    }
                }
            })(2, list, ar);
        }, undefined, undefined, false);
    }
});