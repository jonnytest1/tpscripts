/* global IMPORT,backendUrl */
/**@type {CustomHTMLscript}*/
let knnIOScript = document.currentScript;
knnIOScript.isAsync = true;
function setClassifier(classifier, net) {
    const addExampleClass = (classId, img) => {
        // Get the intermediate activation of MobileNet 'conv_preds' and pass that
        // to the KNN classifier.
        const activation = classifier.mobilenet.infer(img, 'conv_preds');

        // Pass the intermediate activation to the classifier.
        classifier.addExample(activation, classId);
    };
    classifier.mobilenet = net;
    classifier.addExampleClass = addExampleClass;
}

(async function sd() {
    let http = await reqS('http');
    await req('https://unpkg.com/@tensorflow-models/mobilenet');
    await req('https://unpkg.com/@tensorflow-models/knn-classifier');
    let io = (name) => ({
        save: async classifier => {
            let dataset = classifier.getClassifierDataset();
            var datasetObj = {};
            Object.keys(dataset)
                .forEach((key) => {
                    let data = dataset[key].dataSync();
                    datasetObj[key] = Array.from(data);
                });
            let jsonStr = JSON.stringify(datasetObj);

            let newDetails = {
                model: jsonStr
            };
            newDetails.name = name;
            return new Promise((resolver) => {
                http.sendData(backendUrl + '/learning/saveModel.php', newDetails, resolver);
            });

        },
        new: async () => {
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
                http.sendData(backendUrl + '/learning/getModel.php', { name: name }, (e) => {
                    if (e === 404) {
                        error(404);
                        return;
                    }
                    let tensorObj = JSON.parse(e);
                    const classifierData = JSON.parse(tensorObj[0][1]);
                    //covert back to tensor
                    Object.keys(classifierData)
                        .forEach((key) => {
                            classifierData[key] = tf.tensor(classifierData[key], [classifierData[key].length / 1024, 1024]);
                        });
                    classifier.setClassifierDataset(classifierData);
                    setClassifier(classifier, net);
                    resolver(classifier);
                });
            });
        }
    });

    finished(io, true, knnIOScript);
})();