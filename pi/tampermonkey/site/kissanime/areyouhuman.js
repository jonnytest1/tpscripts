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

    let sessionStorage;
    reqS('Storage/SessionStorage')
        .then(st => {
            sessionStorage = st;
            sessionStorage.s('image', {});
        });
    /**@type {httpResolv} */
    let http;
    reqS('http')
        .then(ht => http = ht);

    let formContainer = await sc.g.a('formVerify1');

    if(!formContainer) {
        console.log('formverifynot found');
        return;
    }
    let tags = formContainer.children[0].children[1].children;
    console.log('setting interval');
    /**
    * @typedef {HTMLElement & {
    *   tagArray:Array<string>,
    *   alternative:boolean
    * }} tagElement
    */
    setInterval(() => {

        try {
            [...tags].filter(tag => tag.localName === 'span')
                .forEach(/**@param {tagElement} tag*/tag => {
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

    function hash(imageData) {
        let imageHash = 0;
        for(let byte of imageData) {
            imageHash = ((imageHash << 5) - imageHash) + byte;
            imageHash = imageHash & imageHash;
        }
        return imageHash;
    }

    function onImageLoad(event) {

        let tagArrays = [...tags].filter(tag => tag.localName === 'span');
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

                let matches1 = 0;
                let matches2 = 0;

                let bestones = '<table style="margin-left:50px;">';
                for(let p of pred) {
                    bestones += `<tr><td>${p.tag}</td><td>${Math.round(p.prob * 100) / 100}</td></tr>`;
                    if(tagArrays[0].tagArray.includes(p.tag)) {
                        matches1++;
                    }
                    if(tagArrays[1].tagArray.includes(p.tag)) {
                        matches2++;
                    }
                }

                if(matches1 > 2 || matches2 > 2) {
                    image.style.border = '4px solid green';
                    // image.click();
                }

                /**
                * @type {HTMLElement & {
                *  tags?:Array<string>
                *  weight?:number
                * }}
                **/
                let textNode = document.createElement('div');

                textNode.innerHTML = bestones + '</table>';
                if(matches1 > 1 || matches2 > 1) {
                    textNode.style.border = '1px solid orange';
                }
                image.parentElement.appendChild(document.createElement('br'));
                image.parentElement.appendChild(textNode);

            }
            );
    }

    /**
     * @typedef {HTMLElement & {
    *  tags?:Array<string>
    *  weight?:number
    * }} TagTextElement
     */

    /**@type { HTMLCollectionOf<HTMLElement &{complete:boolean,tag1?:TagTextElement,tag2?:TagTextElement}> } */
    let images = sc.g('img', formContainer);

    [...images].forEach(
        /**@param  i */
        i => {
            i.onload = onImageLoad;
            if(i.complete) {
                onImageLoad({ target: i });
            }
        });

    (function highlight() {
        if([...images].some(img => !img.tag1 || !img.tag2)) {
            setTimeout(highlight, 200);
            return;
        }
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
