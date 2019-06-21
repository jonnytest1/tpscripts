(async function humanTest() {
    console.log('started are you human');

    let sessionStorage = await reqS('Storage/SessionStorage');
    let http = await reqS('http');
    let learningTensorFlow = await reqS('learning/tensorflow');
    let learningTFIO = await reqS('learning/tfIO');

    /*function getClassifier() {
        return new Promise(res => {
            knnio("knnAnime").load().then(res).catch(() => {
                console.log("new")
                knnio("knnAnime").new().then(res);
            })
        })
    }*/

    //const knnio = await reqS("learning/knnIO")

    //const classifier = await getClassifier();

    sessionStorage.s('image', {});
    if (location.search === '') {
        sc.g('a')
            .click();
        return;
    }
    let formContainer = await sc.g.a('formVerify1');

    if (!formContainer) {
        // eslint-disable-next-line no-console
        console.log('formverifynot found');
        return;
    }

    function hash(imageData) {
        let imageHash = 0;
        for (let byte of imageData) {
            imageHash = ((imageHash << 5) - imageHash) + byte;
            imageHash = imageHash & imageHash;
        }
        return imageHash;
    }

    /**@type {model} */
    let kModel;

    tf.loadLayersModel(learningTFIO('kissanime'))
        .then((model) => {
            kModel = model;
        })
        .catch(console.log);

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
                        if (newLocal.tagName.toLowerCase() === 'img') {

                            const number = Number(tagElement.tagArray.filter(t => !isNaN(+t))[0]);
                            //addExample(number, newLocal);
                            debugger;
                            sessionStorage.setValue('image', hash(newLocal.imageData), { img: newLocal.imageData, tags: tagElement.tagArray, chosen: true });
                            // sendData(backendUrl + '/site/kissanime/receiveImageData.php', { image: newLocal.imageData, tags: tag.tagArray }, (e) => { debugger; });
                            newLocal.click();
                        }
                    };
                });
        } catch (e) {
            debugger;
        }
    }, 200);

    function evaluate(image) {

        if ([...tags].filter(tag => tag.localName === 'span')
            .some(t => !t.tagArray) || kModel === undefined) {
            setTimeout(evaluate, 200, image);
            return;
        }
        [...tags]
            .filter(tag => tag.localName === 'span')
            .forEach(tag => {
                sessionStorage.setValue('image', hash(image.imageData), { img: image.imageData, tags: tag.tagArray, chosen: false });

                /*sendData(backendUrl + '/site/kissanime/evaluateImage.php', { data: [...image.imageData, ...tag.tagArray.map(c => c.charCodeAt())] }, (r) => {
                    let textNode = document.createElement('text');
                    textNode.textContent = r - 0;
                    textNode.tags = tag.tagArray;
                    textNode.weight = r - 0;
                    image.parentElement.appendChild(document.createElement("br"));
                    if (!image.tag1) {
                        image.tag1 = textNode;
                    } else {
                        image.tag2 = textNode;
                    }
                    image.parentElement.appendChild(textNode);
                });*/
                if (kModel) {

                    let input = [...image.imageData];

                    /**
                     * @type {Element & {
                    *  tags?:Array<string>
                    *  weight?:number
                    * }}
                     **/
                    let textNode = document.createElement('text');

                    let prediction = kModel.predict(tf.tensor2d([input], [1, input.length]))
                        .dataSync();

                    let probability = prediction[tag.tagArray[2] - 0];
                    textNode.tags = tag.tagArray;
                    textNode.textContent = `${probability} ${textNode.tags[2]}`;
                    textNode.weight = probability;
                    image.parentElement.appendChild(document.createElement('br'));
                    if (!image.tag1) {
                        image.tag1 = textNode;
                    } else {
                        image.tag2 = textNode;
                    }
                    image.parentElement.appendChild(textNode);

                }
            });
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
        for (let j = 0; j < imageData.height - scaleSize; j += scaleSize) {
            for (let i = 0; i < imageData.width - scaleSize; i += scaleSize) {
                let sum = 0;
                let amount = 0;
                for (let x = 0; x < scaleSize; x++) {
                    for (let y = 0; y < scaleSize; y++) {
                        let index = ((i + x) * 4) * imageData.width + ((j + y) * 4);
                        let red = imageData.data[index];
                        let green = imageData.data[index + 1];
                        let blue = imageData.data[index + 2];
                        if (blue !== undefined && red !== undefined && green !== undefined) {
                            amount++;
                            sum += (red + green + blue) / 3;

                        }

                    }
                }
                dataArray.push(Math.round(sum / amount) / 255);

            }
        }
        image.imageData = dataArray;
        evaluate(image);

        const imgEl = document.getElementById('img');
        //classifier.mobilenet.classify(image).then(console.log);

        //draw image in greyscale and smaller below site
        let iD = image.imageData;
        let size = Math.sqrt(iD.length);
        let c = document.createElement('canvas');
        c.height = size;
        c.width = size;
        c.style.width = '50px';
        let ct = c.getContext('2d');
        let imgD = ct.createImageData(size, size);

        let s = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let index = (j * 4) * imgD.width + (i * 4);
                imgD.data[index] = imgD.data[index + 1] = imgD.data[index + 2] = iD[s++] * 255;
                imgD.data[index + 3] = 255;
            }
        }
        ct.putImageData(imgD, 0, 0);
        image.parentElement.insertBefore(c, image.parentElement.children[1]);
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
            if (i.complete) {
                onImageLoad({ target: i });
            }
        });

    (function highlight() {
        if ([...images].some(img => !img.tag1 || !img.tag2)) {
            setTimeout(highlight, 200);
            return;
        }
        /**@type {TagTextElement} */
        let text1;
        /**@type {TagTextElement} */
        let text2;
        [...images].forEach(img => {
            if (!text1 || img.tag1.weight > text1.weight) {
                text1 = img.tag1;
            }
            if (!text2 || img.tag2.weight > text1.weight) {
                text2 = img.tag2;
            }
        });
        if (text1) {
            text1.style.color = 'green';
        }
        if (text2) {
            text2.style.color = 'green';
        }
    })();

})()
    .catch(e => console.trace(e));
