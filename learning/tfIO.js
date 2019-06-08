
/* global IMPORT,backendUrl */
/**@type {CustomHTMLscript}*/
let tfioScript = document.currentScript;
tfioScript.isAsync=true;
(async function sd() {
    let http = await reqS("http");

    let io = (name) => ({
        save: (details) => {
            let newDetails = {
                ...details,
                modelTopology: JSON.stringify(details.modelTopology),
                weightSpecs: JSON.stringify(details.weightSpecs),
                weightData: new Uint8Array(details.weightData)
            };
            newDetails.name = name;
            return new Promise((resolver) => {
                http.sendData(backendUrl + '/learning/saveModel.php', newDetails, (e) => resolver(e));
            });

        },


        load: async (a) => {
            return new Promise((resolver, error) => {
                http.sendData(backendUrl + '/learning/getModel.php', { name: name }, (e) => {
                    if (e == 404) {
                        error(404);
                        return;
                    }
                    const arrayToObject = JSON.parse(e).reduce((obj, item) => {
                        if (item[0] == 'modelTopology' || item[0] == 'weightSpecs') {
                            item[1] = JSON.parse(item[1]);
                        } else if (item[0] == 'weightData') {
                            item[1] = new Uint8Array(JSON.parse('[' + item[1] + ']')).buffer;
                        }
                        obj[item[0]] = item[1];
                        return obj;
                    }, {});
                    resolver(arrayToObject);
                });
            });
        }
    });
    finished(io, true, tfioScript)
})();