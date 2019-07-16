/// <reference path="../../customTypes/index.d.ts" />
/// <reference path="../../notification.js" />
/// <reference path="../../http.js" />
/// <reference path="../../logging.js" />
(async function confirmFnc() {

    await reqS('Storage/SessionStorage');
    let http = await reqS('http');
    await reqS('learning/tensorflow');
    // let tfIO = await reqS('learning/tfIO');

    await reqS('notification');

    let images = sc.S.g('image', {});

    /* tf.loadLayersModel(tfIO('kissanime'))
         .then(train)
         .catch(async error => {
             GMnot('failed loading model');
 
             // return;
             /* let model = tf.sequential();
              let size;
              for (let i in images) {
                  let img = images[i];
                  size = [...img.img].length;
                  break;
              };
 
              let tags = await http('GET', backendUrl + "/site/kissanime/getTags.php");
              let dataset = [];
              do {
                  var imgs = await http('GET', backendUrl + "/site/kissanime/getTags.php");
                  dataset = [...dataset, ...imgs];
              } while (imgs.length == 21)
              debugger;
              //hidden
              model.add(tf.layers.dense({ units: 50, inputShape: [size], activation: 'relu', useBias: true }));
              //output
              model.add(tf.layers.dense({ units: tags.length, activation: 'softmax', useBias: true }));
 
             //train(await reqS('site/kissanime/buildModel'));
 
         });*/
    for(let i in images) {
        let img = images[i];
        //save correct data cant hurt
        debugger;
        http.sendData(backendUrl + '/site/kissanime/receiveImageData.php', { image: img.img, tags: img.tags, chosen: img.chosen }, (e) => { return; });
    }
    async function train(model) {
        try {
            model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam' });

            let inputs = [];
            let outputs = [];
            for(let i in images) {
                let img = images[i];
                let input = [...img.img];

                if(img.chosen) {
                    inputs.push(input);

                    let out = [];
                    for(let j = 0; j < 10; j++) {
                        if(j === img.tags[2] - 0) {
                            out.push(1);
                        } else {
                            out.push(0);
                        }
                    }
                    outputs.push(out);
                }
            }
            const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
            const ys = tf.tensor2d(outputs, [outputs.length, 10])
                .toFloat();

            await model.fit(xs, ys, { epochs: 8 });

            sc.S.s('image', {});

            //await model.save(tfIO('kissanime'));
            //location.href = 'https://kissanime.ru/Special/AreYouHuman2?reUrl=%2fAnime%2fBoruto-Naruto-Next-Generations%2fEpisode-103%3fid%3d157416%26s%3dbeta';
            // GMnot('saved model');
            console.log('saved');
        } catch(error) {
            debugger;
            handleError(error);
        }
    }
})()
    .catch(console.log);
