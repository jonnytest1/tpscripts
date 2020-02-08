/// <reference path="../../customTypes/index.d.ts"/>
/// <reference path="../../graphics/canvas.js"/>
/// <reference path="../../learning/knnIO.js"/>
(async function humanTest() {
    if(location.search === '') {
        sc.g('a')
            .click();
        return;
    }

    console.log('started are you human');

    reqS('graphics/canvas');

    /**
     * @type {CustomStorage}
     */
    let sessionStorage = await reqS('Storage/SessionStorage');

    sessionStorage.s('image', {});

    /**@type {httpResolv} */
    let http;
    reqS('http')
        .then(ht => http = ht);

    let formContainer = await sc.g.a('formVerify1');

    if(!formContainer) {
        console.log('formverifynot found');
        return;
    }
    let tags = [...formContainer.children[0].children[1].children]
        .filter(tag => tag.localName === 'span');
    console.log('setting interval');
    /**
    * @typedef {HTMLElement & {
    *   tagArray:Array<string>,
    *   alternative:boolean
    * }} tagElement
    */
    setInterval(() => {

        try {
            tags.forEach(/**@param {tagElement} tag*/tag => {
                tag.tagArray = tag.textContent.split(', ')
                    .map(t => t.trim());
                tag.draggable = true;
                tag.ondragstart =/**@param {DragEvent &{ target:tagElement}}e*/(e) => {
                    tag.alternative = e.shiftKey;
                };
                tag.ondragend =/**@param {DragEvent & { target : tagElement} }e*/ (e) => {
                    let tagEl = e.target;
                    /**@type {Element &{ imageData?:Array<number>,click?:()=>void}} */
                    const newLocal = document.elementFromPoint(e.x, e.y);
                    if(newLocal.tagName.toLowerCase() === 'img') {
                        let tagList = tagEl.tagArray;
                        if(tagEl.alternative) {
                            tagList = tagList.map(str => {
                                if(!isNaN(+str)) {
                                    return prompt('number', str);
                                }
                                return str;
                            });
                        }
                        sessionStorage.setValue('image', hash(newLocal.imageData), { img: newLocal.imageData, tags: tagList, chosen: true });
                        if(!tagEl.alternative) {
                            newLocal.click();
                        }

                    }
                };
            });

        } catch(e) {
            debugger;
        }
    }, 200);
    sc.menu.addToMenu({
        name: 'autoselect',
        mouseOver: () => {
            sessionStorage.s('autoselect', false);
        }

    });
    function hash(imageData) {
        let imageHash = 0;
        for(let byte of imageData) {
            imageHash = ((imageHash << 5) - imageHash) + byte;
            imageHash = imageHash & imageHash;
        }
        return imageHash;
    }

    /**
     *
     * @param {{
     *   image:HTMLTagImageElement,
     *   matches:Array<import('../../node/classifier').TagEvaluation> }} chosenMatch
     */
    function selectMatch(chosenMatch) {
        const imageData = chosenMatch.image.imageData;
        const tagArrays = tags
            .map(tag => tag.tagArray);
        let tagMatchCounts = { 0: 0, 1: 0 };
        for(let i in tagMatchCounts) {
            for(let tag of tagArrays[i]) {
                if(chosenMatch.matches.map(match => match.tag)
                    .includes(tag)) {
                    tagMatchCounts[i]++;
                }
            }
        }
        let tagArray = tagArrays[tagMatchCounts[0] > tagMatchCounts[1] ? 0 : 1];
        sessionStorage.setValue('image', hash(imageData), { img: imageData, tags: tagArray, chosen: true });

        chosenMatch.image.click();
    }

    function onImageLoad(event) {

        let tagArrays = tags;
        if(tagArrays.some(t => !t.tagArray)) {
            setTimeout(onImageLoad, 200, event);
            return;
        }

        let image = event.target;

        let canvas = document.createElement('canvas');
        canvas.height = image.height;
        canvas.width = image.width;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, 160, 160);
        let imageData = context.getImageData(0, 0, 160, 160);
        let dataArray = [];
        for(let j of imageData.data) {
            dataArray.push(j);
        }

        //debugger;
        image.imageData = dataArray;
        fetch('http://localhost:8080/eval', {
            method: 'POST',
            body: JSON.stringify(dataArray),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(async res => {

                /**@type {import('../../node/classifier').evalResponse} */
                const pred = await res.json();

                /**@type {Array<import('../../node/classifier').TagEvaluation>}*/
                const tagMatches1 = [];
                /**@type {Array<import('../../node/classifier').TagEvaluation>}*/
                const tagMatches2 = [];

                let bestones = '<table style="margin-left:50px;">';
                for(let p of pred) {
                    bestones += `<tr><td>${p.tag}</td><td>${Math.round(p.prob * 100) / 100}</td></tr>`;
                    if(tagArrays[0].tagArray.includes(p.tag)) {
                        tagMatches1.push(p);
                    }
                    if(tagArrays[1].tagArray.includes(p.tag)) {
                        tagMatches2.push(p);
                    }
                }

                /**
                * @type {HTMLElement & {
                *  tags?:Array<string>
                *  weight?:number
                * }}
                **/
                let textNode = document.createElement('div');

                textNode.innerHTML = bestones + '</table>';
                if(tagMatches1.length > 2 || tagMatches2.length > 2) {
                    image.style.border = '4px solid green';
                    addMatch(image, tagMatches1.length > 2 ? tagMatches1 : tagMatches2, tagMatches1.length > 2);
                    // image.click();
                } else if(tagMatches1.length > 1 || tagMatches2.length > 1) {
                    textNode.style.border = '1px solid orange';
                    addMatch(image, tagMatches1.length > 1 ? tagMatches1 : tagMatches2, tagMatches1.length > 1);
                }
                image.parentElement.appendChild(document.createElement('br'));
                image.parentElement.appendChild(textNode);

            });
    }
    /**
     *@type {Object.<number,Array<{
     *   image:HTMLTagImageElement& {imageData:Array<number>},
     *   matches:Array<import('../../node/classifier').TagEvaluation> }>& {clicked?:boolean}>}
     */
    const matches = {};
    let matchCount = 0;

    async function autoSelect() {
        sessionStorage.s('autoselect', true);
        for(let i in matches) {
            let match = matches[i];
            if(!match.clicked) {
                if(match.length === 2 || match.some(tagsMatch => tagsMatch.matches.length === 3)) {
                    match.clicked = true;
                    const match3 = [];
                    for(let j of match) {
                        if(j.matches.length === 3) {
                            match3.push(j);
                        }
                    }
                    let matchArray = match;
                    if(match3.length > 0) {
                        matchArray = match3;
                    }

                    let index = Math.floor(Math.random() * matchArray.length);
                    selectMatch(matchArray[index]);
                }
            }
        }
    }

    /**
     *
     * @param {HTMLTagImageElement & {imageData:Array<number>}} image
     * @param {Array<import('../../node/classifier').TagEvaluation>} imageMatches
     * @param {boolean} tag1
     */
    function addMatch(image, imageMatches, tag1) {
        image.tagged = true;
        let tagIndex = 2;
        if(tag1) {
            tagIndex = 1;
        }
        if(matches[tagIndex] === undefined) {
            matches[tagIndex] = [];
            matches[tagIndex].clicked = false;
        }

        matches[tagIndex].push({
            image: image,
            matches: imageMatches
        });
        matchCount++;

        /**
         * @type {boolean}
         */
        const initial = true;
        if(location.href.includes('Katsute-Kami-Datta-Kemono-tachi') || sessionStorage.g('autoselect', initial) === true) {
            autoSelect();
        }
    }

    /**
     * @typedef {HTMLElement & {
    *  tags?:Array<string>
    *  weight?:number,
    *  image?:HTMLTagImageElement
    * }} TagTextElement
    *
    * @typedef {HTMLElement & {
    * complete:boolean,
    * tag1?:TagTextElement,
    * tag2?:TagTextElement,
    * tagged?:boolean,
    * imageData:Array<number>
    * }} HTMLTagImageElement
    *
     */

    /**@type { HTMLCollectionOf<HTMLTagImageElement> } */
    let images = sc.g('img', formContainer);
    if(images.length > 15) {
        debugger;
        new Notification('too many images');
        sessionStorage.s('autoselect', false);
    } else {
        sessionStorage.s('autoselect', true);
    }
    [...images].forEach(
        /**@param  i */
        i => {
            i.onload = onImageLoad;
            if(i.complete) {
                onImageLoad({ target: i });
            }
        });

    setTimeout(() => {
        const foundMatches1 = (matches[1] || []).length;
        const foundMatches2 = (matches[2] || []).length;

        let remainingImages = [...images].filter(image => !image.tagged);

        for(let i = 0; i < 2 - foundMatches1; i++) {

            const index = Math.floor(Math.random() * remainingImages.length);
            /**@type {any} */
            const image = remainingImages[index];
            remainingImages.splice(index, 1);
            addMatch(image, [], true);
        }

        for(let i = 0; i < 2 - foundMatches2; i++) {
            const index = Math.floor(Math.random() * remainingImages.length);
            /**@type {any} */
            const image = remainingImages[index];
            remainingImages.splice(index, 1);
            addMatch(image, [], false);
        }

        if(!matches[1].clicked || !matches[2].clicked) {
            debugger;
        }

    }, 3000);

    (function highlight() {
        if([...images].some(img => !img.tag1 || !img.tag2)) {
            setTimeout(highlight, 200);
            return;
        }
        const images1 = [];
        const images2 = [];
        /**@type {TagTextElement} */
        let text1;
        /**@type {TagTextElement} */
        let text2;
        [...images].forEach(img => {
            if(!text1 || img.tag1.weight > text1.weight) {
                text1 = img.tag1;
            }
            if(!text2 || img.tag2.weight > text1.weight) {
                text2 = img.tag2;
            }
        });
        if(text1) {
            text1.style.color = 'green';
        }
        if(text2) {
            text2.style.color = 'green';
        }
    })();

})()
    .catch(e => console.trace(e));
