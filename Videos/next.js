


function openNext(link, links, excludedLinks) {
    for (var i in links) {
        if (links[i].className === link.link && link.priority > -1) {
            let linkElement = links[i].children[1].children[0];
            if (!excludedLinks.some(link => linkElement.href == link)) {
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
