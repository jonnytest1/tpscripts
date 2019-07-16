(async function humanTest() {
    if(location.search === '') {
        sc.g('a')
            .click();
        return;
    }

    console.log('started are you human');

    const modelName = 'knnAnime';

    reqS('graphics/canvas');

    reqS('learning/tensorflow');
    let knnio = await reqS('learning/knnIO');
    const knnLoader = knnio(modelName, false);
    let sessionStorage;
    reqS('Storage/SessionStorage')
        .then(st => {
            sessionStorage = st;
            sessionStorage.s('image', {});
        });
    let http;
    reqS('http')
        .then(ht => http = ht);

    async function getClassifier() {
        return new Promise(res => {
            knnLoader
                .load()
                .then(res)
                .catch(() => {
                    alert('failed');
                    return;
                    console.log('new');
                    knnLoader
                        .new()
                        .then(res);
                });
        });
    }

    console.log('loading classifier');
    //const classifier = await getClassifier();
    console.log('got classifier');

    let formContainer = await sc.g.a('formVerify1');

    if(!formContainer) {
        // eslint-disable-next-line no-console
        console.log('formverifynot found');
        return;
    }
    let tags = formContainer.children[0].children[1].children;
    console.log('setting interval');
    setInterval(() => {
        try {
            [...tags].filter(tag => tag.localName === 'span')
                .forEach(tag => {
                    tag.tagArray = tag.textContent.split(', ')
                        .map(t => t.trim());
                    tag.draggable = true;
                    tag.ondragend = (e) => {
                        let tagElement = e.target;
                        /**@type {Element &{ imageData?:Array<number>,click?:()=>void}} */
                        const newLocal = document.elementFromPoint(e.x, e.y);
                        if(newLocal.tagName.toLowerCase() === 'img') {
                            sessionStorage.setValue('image', hash(newLocal.imageData), { img: newLocal.imageData, tags: tagElement.tagArray, chosen: true });
                            newLocal.click();
                        }
                    };
                });
        } catch(e) {
            debugger;
        }
    }, 200);

    const cWrapper = new CanvasWrapper();
    function hash(imageData) {
        let imageHash = 0;
        for(let byte of imageData) {
            imageHash = ((imageHash << 5) - imageHash) + byte;
            imageHash = imageHash & imageHash;
        }
        return imageHash;
    }

    ///**@type {model} */
    //let kModel;

    /*tf.loadLayersModel(learningknnio(modelName))
        .then((model) => {
            kModel = model;
        })
        .catch(console.log);*/

    const tagMapping = await getTags();
    /**
     * @param {HTMLImageElement &{imageData:Array<number>}} image
     */
    async function evaluate(image) {
        let tagArrays = [...tags].filter(tag => tag.localName === 'span');
        if(tagArrays.some(t => !t.tagArray) || classifier === undefined) {
            setTimeout(evaluate, 200, image);
            return;
        }

        const iD = cWrapper.draw(image.imageData, false);
        const activation = classifier.mobilenet.infer(iD, 'conv_preds');
        const result = await classifier.predictClass(activation);

        let results = [];
        for(let i in result.confidences) {
            results.push({ i: i, percent: result.confidences[i] });
        }
        results.sort((a, b) => b.percent - a.percent);
        let bestones = '';
        debugger;
        let matches1 = 0;
        let matches2 = 0;
        for(let i = 0; i < 5; i++) {
            const tag = tagMapping.find(el => el.id === +results[i].i);
            bestones += tag.tag + `prob: ${results[i].percent}<br>`;
            if(tagArrays[0].tagArray.includes(tag.tag)) {
                matches1++;
            }
            if(tagArrays[1].tagArray.includes(tag.tag)) {
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

        textNode.innerHTML = bestones;
        if(matches1 > 1 || matches2 > 1) {
            textNode.style.border = '1px solid lightgreen';
        }
        image.parentElement.appendChild(document.createElement('br'));
        image.parentElement.appendChild(textNode);

        [...tags]
            .filter(tag => tag.localName === 'span')
            .forEach(tag => {
                sessionStorage.setValue('image', hash(image.imageData), { img: image.imageData, tags: tag.tagArray, chosen: false });
            });
    }

    /**@returns {Promise<Array<tag>>} */
    async function getTags() {

        let dbtags = await (await reqS('http')).http('GET', backendUrl + '/site/kissanime/getTags.php');
        /**@type {Array<tag>} */
        let parsedTags = dbtags.map(a => ({ tag: a[1], id: a[0] }));
        return parsedTags;
    }

    function onImageLoad(event) {
        let image = event.target;

        let canvas = document.createElement('canvas');
        canvas.height = image.height;
        canvas.width = image.width;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, 160, 160);
        let imageData = context.getImageData(0, 0, 160, 160);
        let dataArray = [];
        let scaleSize = 2;
        for(let j = 0; j < imageData.data.length; j++) {
            dataArray.push(imageData.data[j]);
        }
        image.imageData = dataArray;
        // evaluate(image)
        //    .catch(console.error);

        const imgEl = document.getElementById('img');
        //classifier.mobilenet.classify(image).then(console.log);

        //draw image in greyscale and smaller below site
        /*let iD = image.imageData;
        let size = Math.sqrt(iD.length);
        let c = document.createElement('canvas');
        c.height = size;
        c.width = size;
        c.style.width = '50px';
        let ct = c.getContext('2d');
        let imgD = ct.createImageData(size, size);

        let s = 0;
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                let index = (j * 4) * imgD.width + (i * 4);
                imgD.data[index] = imgD.data[index + 1] = imgD.data[index + 2] = iD[s++] * 255;
                imgD.data[index + 3] = 255;
            }
        }
        ct.putImageData(imgD, 0, 0);
        image.parentElement.insertBefore(c, image.parentElement.children[1]);*/
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
