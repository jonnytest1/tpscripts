/* global IMPORT,backendUrl */
///<reference path="../customTypes/tensorflow-loader.d.ts"/>
/**
 * @typedef {TensorflowLoaderSelector} KNNLoader
 */

/**@type {CustomHTMLscript}*/
let knnIOScript = document.currentScript;
knnIOScript.isAsync = true;
function setClassifier(classifier, net) {
    const addExampleClass = (classId, img) => {
        // Get the intermediate activation of MobileNet 'conv_preds' and pass that
        // to the KNN classifier.
        /**
         * @type {TensorObject}
         */
        const activation = classifier.mobilenet.infer(img, 'conv_preds');

        // Pass the intermediate activation to the classifier.
        classifier.addExample(activation, classId);
        activation.dispose();
    };
    classifier.mobilenet = net;
    classifier.addExampleClass = addExampleClass;
}

(async function sd() {
    let http = await reqS('http');
    await req('https://unpkg.com/@tensorflow-models/mobilenet');
    await req('https://unpkg.com/@tensorflow-models/knn-classifier');
    let io = (name, allowDB = true) => ({
        save: async classifier => {
            let dataset = classifier.getClassifierDataset();
            var datasetObj = {};

            let newDetails = {
                name
            };
            let amount = 0;
            Object.keys(dataset)
                .forEach((key) => {
                    amount++;
                    let data = dataset[key].dataSync();
                    newDetails[key] = Array.from(data);
                });
            let jsonStr = JSON.stringify(datasetObj);

            return new Promise(async (resolver) => {
                await http.sendData(backendUrl + '/learning/saveModel.php', newDetails, (data) => {
                    resolver(data);
                });
                /*  let response = '';
                  let count = 0;
                  for(let i in newDetails) {
                      const reqData = {
                          name
                      };
                      reqData[i] = newDetails[i];
                      try {
                          document.querySelector('#text').textContent = `saved ${count++} / ${amount}`;
                      } catch(e) {
                          //
                      }
                      response +=;
                  }
                  document.querySelector('#text').textContent = 'saved all';
                  */
            });

        },
        new: async () => {
            console.log('new model');
            // @ts-ignore
            const net = await mobilenet.load();
            // @ts-ignore
            const classifier = knnClassifier.create();
            setClassifier(classifier, net);
            return classifier;
        },

        load: async () => {
            return new Promise(async (resolver, error) => {
                // @ts-ignore
                const net = await mobilenet.load();
                // @ts-ignore
                const classifier = knnClassifier.create();
                if(allowDB) {
                    var dbPromise = indexedDB.open('test-db4', 1);
                    dbPromise.onsuccess = (e) => {
                        try {
                            /**
                                     * @type {IDBDatabase}
                                     */
                            // @ts-ignore
                            const database = e.target.result;
                            const transaction = database.transaction(['ka'], 'readonly');
                            transaction.onerror = fetchFromBE;
                            const store = transaction.objectStore('ka');
                            const request = store.get('data');
                            request.onsuccess = (ev) => {
                                setData(JSON.parse(request.result));

                            };
                            request.onerror = fetchFromBE;
                        } catch(error) {
                            fetchFromBE();
                        }
                    };
                    dbPromise.onerror = () => {
                        fetchFromBE();
                    };
                } else {
                    fetchFromBE();
                }
                function fetchFromBE() {
                    http.sendData(backendUrl + '/learning/getModel.php', { name: name }, (e) => {
                        if(e === 404) {
                            error(404);
                            return;
                        }
                        let tensorObj = JSON.parse(e);
                        let classifierData = {};
                        tensorObj.forEach(ar => {
                            if(ar[0] === 'name' || ar[0] === 'timestamp') {
                                return;
                            }
                            const tensorArray = JSON.parse(`[${ar[1]}]`);
                            classifierData[ar[0]] = tf.tensor(tensorArray, [tensorArray.length / 1024, 1024]);

                        });
                        var saveDB = indexedDB.open('imageClassifier', 1);
                        saveDB.onsuccess = (e) => {
                            /**
                                     * @type {IDBDatabase}
                                     */
                            // @ts-ignore
                            const database = e.target.result;
                            const transaction = database.transaction([name], 'readwrite');
                            const store = transaction.objectStore(name);
                            store.put(JSON.stringify(classifierData), 'data');
                        };
                        saveDB.onupgradeneeded = (e) => {
                            /**
                             * @type {IDBDatabase}
                             */
                            // @ts-ignore
                            const database = e.target.result;
                            const store = database.createObjectStore(name);
                            store.createIndex('key', 'key', { unique: true });
                            store.createIndex('value', 'value', { unique: false });
                            const insertRequest = store.put(JSON.stringify(classifierData), 'data');
                            insertRequest.onsuccess = () => {
                                console.log('added DAta');
                            };
                        };
                        setData(classifierData);

                    });
                }
                function setData(classifierData) {
                    classifier.setClassifierDataset(classifierData);
                    setClassifier(classifier, net);
                    resolver(classifier);

                }

            });
        }
    });

    finished(io, true, knnIOScript);
})();