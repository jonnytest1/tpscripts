/// <reference path="../../customTypes/index.d.ts" />
/* global IMPORT,menu */

/**
* @typedef {{ link:string,priority:number}} videoLink
*/

let buttonsfornextinstance = 'nextbuttons';
sc.g.a('linktable')
    .then(async function watchSeriesEpisode() {

        await reqS('Storage/crossDomainStorage');

        sc.CD.s(buttonsfornextinstance, new Array(0));
        let nextButton = sc.g.C('npbutton button-next');
        if(nextButton) {
            if(nextButton.length) {
                nextButton = nextButton[0];
            }
            sc.CD.p(buttonsfornextinstance, ['next', nextButton.href, location.href], new Array(0));
        }
        else {
            //await sc.S.Storage_crossDomainStorage.s("autoplay", false);
        }
        let previousButton = sc.g.C('npbutton button-previous');
        if(previousButton) {
            if(previousButton.length) {
                previousButton = previousButton[0];
            }
            sc.CD.p(buttonsfornextinstance, ['previous', previousButton.href, location.href], new Array(0));
        }
        sc.CD.p(buttonsfornextinstance, [{ addVideoButtons: true }]);
        var parent = sc.g.C('nextprev');
        if(!parent) {
            parent = sc.g.C('channel-title');
        }
        if(parent.length) {
            parent = parent[0];
        }

        sc.menu.addToMenu({
            name: 'previous',
            isValid: () => !!document.querySelector('.button-previous'),
            mouseOver: () => {
                /**
                 * @type {HTMLElement}
                 */
                const button = document.querySelector('.button-previous');
                button.click();
            }
        });

        sc.menu.addToMenu({
            name: 'autoplay',
            mouseOver: () => {
                sc.CD.s('autoplay', true);
                setlink();
            }
        });
        sc.menu.addToMenu({
            name: 'next',
            isValid: () => !!document.querySelector('.button-next'),
            mouseOver: () => {
                /**
                 * @type {HTMLElement}
                 */
                const button = document.querySelector('.button-next');
                button.click();
            }
        });

        if((sc.CD.g('autoplay', false) && false) || location.hash.indexOf('autoplay') > -1) {
            setlink();
        }
    });

async function setlink() {
    let next = await reqS('Videos/next');
    history.pushState(null, document.title, location.href);

    let container = sc.g('tbody');
    /**@type {Array<string>} */
    var excludedLinks = sc.CD.g('exclude', []);
    if(container) {
        //----------------------------------------------------------------------------------------
        /**
         * @type {Array<videoLink>}
         */
        let linkarray = [
            { link: 'download_link_vidup.me ', priority: 100 },
            { link: 'download_link_movpod.in ', priority: 55 },
            { link: 'download_link_openload.co ', priority: 70 },
            { link: 'download_link_powvideo.net ', priority: 80 },
            { link: 'download_link_vidtodo.com ', priority: 200 }
        ]; //, "download_link_thevideo.me ""download_link_nowvideo.sx ",
        let sorted = linkarray.sort((p, a) => a.priority - p.priority);
        var opened = false;
        /**@type {Array<HTMLAnchorElement & {children:Array<any>}>} */
        var list = [...container.children]
            .filter(current => linkarray.some(implemnnted => implemnnted.link === current.className))
            .sort((l1, l2) =>
                linkarray.find(link => l2.className === link.link).priority
                - linkarray.find(link => l1.className === link.link).priority
            );
        if(excludedLinks.length > 0) {
            let last = list.find(link => link.children[1].children[0].href === excludedLinks[excludedLinks.length - 1]);
            if(last) {
                let nextType = linkarray.find(linkType => linkType.link !== last.className);
                if(nextType) {
                    if(next(nextType, list, excludedLinks)) {
                        opened = true;
                    }
                }
            }
        }
        if(!opened) {
            for(let link of sorted) {
                if(next(link, list, excludedLinks)) {
                    opened = true;
                    break;
                }
                if(opened) {
                    break;
                }
            }
        }
        if(!opened) {
            if(list.length === 0) {
                alert('no videos found');
            }
            alert('no hoster linked');
        }
    }
    else {
        console.log('no links for this episode');
        try {
            navigate(sc.g.C('npbutton button-next')[0].href);
        }
        catch(error) {
            //
        }
    }
}