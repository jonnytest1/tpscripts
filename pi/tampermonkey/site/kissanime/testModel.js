/// <reference path="../../customTypes/index.d.ts" />
/// <reference path="../../graphics/canvas.js" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var testMOdel = new EvalScript('', {
    run: async (resolv, set) => {
        let [_tensorflow, progress, _canvas, getImageDAta] = await reqS([
            'learning/tensorflow',
            'DOM/progress-overlay',
            'graphics/canvas',
            'site/kissanime/data-to-browser-db']);
        /**
         * @type {Array<any>}
         */
        let data1 = await getImageDAta();

        /**
         *
         * @param {{data:string,tags:Array<{image: number,tag_id: number,tag_name:string}>}} image
         */
        function toObjectArray(image) {
            const imageDAta = JSON.parse(image.data);
            const pixels = [];
            for(let i = 0; i < imageDAta.length; i += 4) {
                pixels.push([imageDAta[i], imageDAta[i + 1], imageDAta[i + 2], imageDAta[i + 3]]);
            }

            return { tags: image.tags, pixels };
        }
        const objectArrays = data1.map(toObjectArray);
        data1 = undefined;
        /**
         * @type {Array<{image: number,tag_id: number,tag_name:string}>}
         */
        const tagIds = [];
        objectArrays.map(ebj => ebj.tags)
            .reduce((a, b) => [...a, ...b], [])
            .sort((a, b) => a.tag_id - b.tag_id)
            .forEach(tag => {
                if(!tagIds.some(ttag => ttag.tag_id === tag.tag_id) && !isNaN(+tag.tag_name)) {
                    tagIds.push(tag);
                }
            });

        const canvasWrapper = new CanvasWrapper(true);
        const tagArray = objectArrays
            .map(el => tagIds
                .map(tag => {
                    if(!el.tags.map(ttag => ttag.tag_id)
                        .includes(tag.tag_id)) {
                        return 0;
                    }
                    return 1;
                }));

        const iamgeArray = [];
        objectArrays.forEach(el => {
            const iD = el.pixels.flatMap(e => {
                return e.filter((e, i) => i !== 3);
            });//canvasWrapper.drawForConv();
            delete el.pixels;
            delete el.tags;
            iamgeArray.push(iD);
        });

        const model = NeuralWrapper.shapeDetector2D(iamgeArray[0], 70, tagIds.length);

        const history = await model.fit(iamgeArray, tagArray, {
            epochs: 30,
            validationSplit: 0.6,
            progressMonitor: progress(o => 0, { text: 'training' })

        });
        console.log(history.history.acc);
    },
    reset: (set) => {
        //nothing for now

    }
});