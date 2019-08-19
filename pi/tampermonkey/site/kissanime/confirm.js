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

    for(let i in images) {
        let img = images[i];
        //save correct data cant hurt
        debugger;
        //+ '/site/kissanime/receiveImageData.php'
        await fetch('http://localhost:8080/add', {
            body: JSON.stringify({ image: img.img, tags: img.tags, chosen: img.chosen }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }

        });
    }
    sc.S.s('image', {});
    querydoc('#containerRoot').style.backgroundColor = 'linear-gradient(#161616, #8f8f96)';
    // location.href = "https://kissanime.ru/Special/AreYouHuman2?reUrl=%2fAnime%2fKatsute-Kami-Datta-Kemono-tachi-e%2fEpisode-004%3fid%3d160517%26s%3dnova";
})()
    .catch(console.log);
