/// <reference path="../../customTypes/index.d.ts" />
/// <reference path="../../notification.js" />
/// <reference path="../../http.js" />
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
        await fetch('http://localhost:8080/add', {
            body: JSON.stringify({ image: img.img, tags: img.tags, chosen: img.chosen }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }

        });
    }
    sc.S.s('image', {});
    querydoc('#containerRoot').style.background = 'linear-gradient(#161616, #8f8f96)';
    if(location.href === 'https://kissanime.ru/Anime/Katsute-Kami-Datta-Kemono-tachi-e/Episode-004?id=160517&s=nova') {
        location.href = 'https://kissanime.ru/Special/AreYouHuman2?reUrl=%2fAnime%2fKatsute-Kami-Datta-Kemono-tachi-e%2fEpisode-004%3fid%3d160517%26s%3dnova';
    }
})()
    .catch(console.log);
