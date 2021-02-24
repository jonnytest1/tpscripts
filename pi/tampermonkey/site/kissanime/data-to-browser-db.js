/// <reference path="../../customTypes/index.d.ts" />
/**
 * @type {{type:EvalScript<{}>}}
 */
var datatobrowserdb = new EvalScript('', {
    waitForResolver: true,
    cacheFncResult: true,
    run: async (resolv, set) => {
        const idb = await reqS('libs/indexeddb');

        const progress = await reqS('DOM/progress-overlay');
        const idbDBKey = 'kissanimedata';
        /**
         * @returns {Promise<any>}
         */
        async function getPreviousTrainingData() {
            return new Promise(async (resolver) => {
                if(true) {
                    try {

                        const dataLsit = [];
                        const progressOtionsRef = await progress(o => 0, { text: 'loading indexed db' });
                        const data = await idb.getCursor(idbDBKey, { progressMonitor: progressOtionsRef });
                        progressOtionsRef.remove();
                        resolver(data);
                    } catch(e) {
                        debugger;
                        await fetchFromDB();
                    }
                } else {
                    await fetchFromDB();
                }
            });
        }

        resolv(getPreviousTrainingData);
        async function fetchFromDB() {
            return new Promise(async (resolver) => {
                //let tags = await getTags();
                /**@type {Array<any>} */
                let outputs = [];
                let highest = -1;

                const http = await reqS('http');

                progress(async (o) => {
                    /**
                     * @type {{highestId:number,maxId:number,data:Array<{imagedata:string,tags:Array<string>,image_id:number}>}}
                     */
                    let imgs = await http.http('GET', `http://localhost:8080/examples?min=${o.count}`);
                    o.max = imgs.highestId;

                    o.count = imgs.maxId;

                    if(!o.start) {
                        o.start = o.count;
                    }
                    for(let image of imgs.data) {
                        outputs.push({ image });
                        idb.put(idbDBKey, image.image_id, { data: image.imagedata, tags: image.tags });
                    }
                    return 0;
                }, {
                    text: 'storing db data'
                });
                // const newLocal = { tagList: tags, data: outputs };

                resolver(outputs);
            });
        }

    },
    reset: (set) => {

        //
    }
});