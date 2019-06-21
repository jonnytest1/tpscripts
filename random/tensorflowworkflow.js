
/*
softmax mutually exclusive 0-1
simgoid 0-1 for each
//activations : ('elu'|'hardSigmoid'|'linear'|'relu'|'relu6'| 'selu'|'sigmoid'|'softmax'|'softplus'|'softsign'|'tanh')
//compilers meanSquaredError categoricalCrossentropy meanAbsoluteError sparseCategoricalAccuracy

/* global createCanvas,IMPORT,tfs,http,backendUrl,tf,createImage,image,frameRate */
/*
// eslint-disable-next-line
let learning_tensorflow = IMPORT;
// eslint-disable-next-line
let learning_tfIO = IMPORT;
// eslint-disable-next-line
let graphics_p5import = IMPORT;

let xs = [];
let ys = [];

let index = 0;
// eslint-disable-next-line
function setup() {
    createCanvas(100, 100);
}
// eslint-disable-next-line
function draw() {
    return;
    // eslint-disable-next-line
    if (xs.length > 100) {
        let iD = xs[index];
        let size = Math.sqrt(iD.length);
        let img = createImage(size, size);
        img.loadPixels();

        let s = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let index = (j * 4) * size + (i * 4);
                img.pixels[index] = img.pixels[index + 1] = img.pixels[index + 2] = iD[s++] * 255;
                img.pixels[index + 3] = 255;
            }
        }
        img.updatePixels();
        image(img, 0, 0);
        index = (index + 1) % xs.length;
    }
    frameRate(3);
}

tfs.onload = async () => {
    return;
    let tags = await http('GET', backendUrl + "/site/kissanime/getTags.php");
    tags = tags.filter(t => !isNaN(t[1]));

    xs = [];
    let outputs = [];
    let highest = -1;
    let imgs = [];
    let img_size;
    do {
        imgs = await http('GET', backendUrl + "/site/kissanime/getImages.php?minID=" + highest);
        for (let image of imgs) {
            let id = image[0] - 1;
            if (id > highest) {
                highest = id;
            }
            let img_data = JSON.parse("[" + image[4].replace(/"/g, "") + "]");
            //let result = [];
            img_size = Math.sqrt(img_data.length);
            /* for (let i = 0; i < img_size; i++) {
                 for (let j = 0; j < img_size; j++) {
                     let index = (j * 4) * img_size + (i * 4);
                     if (!result[i]) {
                         result[i] = [];
                     }
                     result[i][j] = img_data[index];
                 }
             }//

xs.push(img_data);
let yArray = new Array(tags.length).fill(0);
for (let i = 1; i < 4; i++) {
    let index = tags.findIndex(el => el[1] == image[i]);
    if (index != -1) {
        yArray[index] = 1;
    }
}
outputs.push(yArray);
        }
    } while (imgs.length == 21);

//let size = xs[0].length;

xs = xs.map(t => tf.tensor2d(t, [1, t.length]));
ys = outputs.map(t => tf.tensor2d(t, [1, t.length]));

const model = tf.sequential();

model.add(tf.layers.conv2d({
    inputShape: [img_size, img_size, 1],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling'
}));
model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2]
}));
model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling'
}));
model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2]
}));
model.add(tf.layers.flatten());
//hidden
// model.add(tf.layers.dense({ units: 100, activation: 'sigmoid', useBias: true }));
//output
model.add(tf.layers.dense({ units: tags.length, kernelInitializer: 'VarianceScaling', activation: 'softmax', useBias: true }));

const LEARNING_RATE = 0.08;

const optimizer = tf.train.sgd(LEARNING_RATE);

model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
});
// eslint-disable-next-line no-console
console.log("compiled model");

async function train() {
    for (let x = 0; x < xs.length; x++) {
        let t = xs[x].reshape([1, img_size, img_size, 1]);
        await model.fit(t, ys[x], { epochs: 1 });
    }
    // eslint-disable-next-line no-console
    console.log("trained");
    let correct = 0;
    for (let x = 0; x < xs.length; x++) {
        try {
            let t = xs[x].reshape([1, img_size, img_size, 1]);
            let prediction = model.predict(t).dataSync();

            //let tagA = [];
            let tagI = [];
            // eslint-disable-next-line
            function max(n, arr) {
                let array = [...arr];
                let max;
                let mIndex;
                do {
                    max = Math.max(...array);
                    mIndex = array.indexOf(max);
                    array[mIndex] = -1;
                } while (n != null && max >= n);
                //tagA.push(tags[mIndex][1]);
                tagI.push(mIndex);
                return max;
            }

            max(null, prediction);

            let success = true;
            for (let i of tagI) {
                if (outputs[x][i] != 1) {
                    success = false;
                }
            }
            if (success) {
                correct++;
            }
        } catch (e) {
            // eslint-disable-next-line
            debugger;
        }
    }
    // eslint-disable-next-line
    console.log(correct / xs.length);
    document.body.innerHTML = correct / xs.length;
}

train();
window.train = train;

    /* model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

     model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

     let x = [];
     let y = [];

     let data = 100;

     for (let i = 0; i < data; i++) {
         let t = Math.floor(Math.random() * data);
         x.push(t);
         y.push(f(t));
     }

     //const xs = tf.tensor2d(x, [data, 1]);
     // const ys = tf.tensor2d(y, [data, 1]);

     const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
     const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

     await model.fit(xs, ys, { epochs: 250 });

     point1Y =
         model.predict(tf.tensor2d([-10], [1, 1])).dataSync()[0];
     point2Y =
         model.predict(tf.tensor2d([400], [1, 1])).dataSync()[0];

     let test = document.createElement("text");
     test.innerText = model.predict(tf.tensor2d([400], [1, 1])).dataSync();
     document.body.appendChild(test);

     //const saveResult = await model.save(
     //    io('test123')
     // );
     //let model2 = await tf.loadLayersModel(io('test123'));

};*/