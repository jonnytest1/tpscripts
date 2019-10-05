/// <reference path="../site/swatchseries/swatchseries.to%episode%.js" />
/**
 *
 * @param {videoLink} link
 * @param {Array<any>} links
 * @param {Array<string>} excludedLinks
 */
function openNext(link, links, excludedLinks) {
    for(var i in links) {
        if(links[i].className === link.link && link.priority > -1) {
            let linkElement = links[i].children[1].children[0];
            if(!excludedLinks.some(url => linkElement.href === url)) {
                location.href = linkElement.href;
                return true;
            } else {
                linkElement.textContent = 'already checked';
            }
        }
    }
    return false;
}
finished(openNext);
