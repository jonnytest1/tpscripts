let video;
let features;
let knn;
let labelP;
let ready = false;
let x;
let y;
let label = 'nothing';

function setup() {
    createCanvas(0, 0);
    video = createCapture(VIDEO);
    video.size(700, 500);
    features = ml5.featureExtractor('MobileNet', modelReady);
    knn = ml5.KNNClassifier();
    labelP = createP('Training Data Required');
    labelP.style('font-size', '32pt');
    x = width / 2;
    y = height / 2;
}

function goClassify() {
    const logits = features.infer(video);
    knn.classify(logits, function(error, result) {
        if(error) {
            console.error(error);
        } else {
            debugger;
            label = result.label;
            labelP.html(result.label);
            goClassify();
        }
    });
}

function keyPressed() {
    const logits = features.infer(video);
    if(key == '1') {
        knn.addExample(logits, 'The Car Park is Currently Empty: Many Spaces Available!');
        console.log('Empty');
    } else if(key == '2') {
        knn.addExample(logits, 'The Car Park is Currently Filling Up: Limited Spaces Available!');
        console.log('Half-Full');
    } else if(key == '3') {
        knn.addExample(logits, 'The Car Park is Nearly Full: Very Limited Spaces Available!');
        console.log('Nearly Full');
    } else if(key == '4') {
        knn.addExample(logits, 'The Car Park is Currently Full: No Spaces Available!');
        console.log('Full');
    } else if(key == 's') {
        save(knn, 'model.json');
        //knn.save('model.json');
    }
}

function modelReady() {
    console.log('model ready!');
    // Comment back in to load your own model!
    // knn.load('model.json', function() {
    // console.log('knn loaded');
    // });
}

function draw() {

    if(label == 'empty') {
        x--;
    } else if(label == 'right') {
        x++;
    } else if(label == 'up') {
        y--;
    } else if(label == 'down') {
        y++;
    }

    //image(video, 0, 0);
    if(!ready && knn.getNumLabels() > 0) {
        goClassify();
        ready = true;
    }
}

// Temporary save code until ml5 version 0.2.2
const save = (knn, name) => {
    const dataset = knn.knnClassifier.getClassifierDataset();
    if(knn.mapStringToIndex.length > 0) {
        Object.keys(dataset).forEach(key => {
            if(knn.mapStringToIndex[key]) {
                dataset[key].label = knn.mapStringToIndex[key];
            }
        });
    }
    const tensors = Object.keys(dataset).map(key => {
        const t = dataset[key];
        if(t) {
            return t.dataSync();
        }
        return null;
    });
    let fileName = 'myKNN.json';
    if(name) {
        fileName = name.endsWith('.json') ? name : `${name}`.json;
    }
    saveFile(fileName, JSON.stringify({ dataset, tensors }));
};

const saveFile = (name, data) => {
    const downloadElt = document.createElement('a');
    const blob = new Blob([data], { type: 'octet/stream' });
    const url = URL.createObjectURL(blob);
    downloadElt.setAttribute('href', url);
    downloadElt.setAttribute('download', name);
    downloadElt.style.display = 'none';
    document.body.appendChild(downloadElt);
    downloadElt.click();
    document.body.removeChild(downloadElt);
    URL.revokeObjectURL(url);
};