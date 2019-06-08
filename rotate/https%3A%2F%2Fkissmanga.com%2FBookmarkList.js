/* global IMPORT */
// eslint-disable-next-line no-unused-vars
/// <reference path="../customTypes/index.d.ts" />
/// <reference path="../notification.js" />
await reqS("http");

await reqS("notification");

document.title = document.title.replace("Read manga", "");

function bookmarkcheck(url) {
    var ar = url.split("<td title='");
    var list = document.getElementsByClassName("listing")[0].children[0].children;
    for (var i = 2; i < list.length; i++) {
        let readStatus = [...list[i].children[2].children].filter((a) => a.style.display != 'none')[0].textContent.trim();
        if (readStatus === "Read") {
            break;
        }
        else {
            for (var j = 1; j < ar.length; j++) {
                var t1 = location.origin + "/Manga/" + ar[j].split("href=\"/Manga/")[1].split("\">")[0];
                if (t1 === list[i].children[0].children[0].href) {
                    url = ar[j].split("src=\"")[1].split("\" style=")[0];
                    break;
                }
            }
            let status = list[i].children[1].textContent.trim();
            let openurl;
            if (status == 'Completed') {
                openurl = list[i].children[0].children[0].href;
            }
            else {
                openurl = list[i].children[1].children[0].href;
            }
            GMnot("Manga: " + list[i].children[0].textContent.trim(), list[i].children[1].textContent.trim(), url, () => { }, openurl);
            list[i].children[2].children[1].click();
            open(openurl);
        }
    }
}
http('GET', location.href, bookmarkcheck);
