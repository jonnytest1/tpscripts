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

    const examples = Object.values(images)
        .map(img => ({ image: img.img, tags: img.tags, chosen: img.chosen }));

    if(examples.length > 0) {
        await fetch('http://localhost:8080/add', {
            body: JSON.stringify(examples),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    sc.S.s('image', {});
    querydoc('#containerRoot').style.background = 'linear-gradient(#161616, #8f8f96)';
    if(location.href === 'https://kissanime.ru/Anime/Katsute-Kami-Datta-Kemono-tachi-e/Episode-004?id=160517&s=nova') {
        setTimeout(() => {
            location.href = 'https://kissanime.ru/Special/AreYouHuman2?reUrl=%2fAnime%2fKatsute-Kami-Datta-Kemono-tachi-e%2fEpisode-004%3fid%3d160517%26s%3dnova';
        }, 500);
    } else {
        sc.menu.addToMenu({
            name: 'next',
            mouseOver: () => {
                const nextImg = document.querySelector('#btnNext');
                if(nextImg) {
                    const nextLink = nextImg.closest('a');
                    navigate(nextLink.href);
                }
            }
        });
    }
})()
    .catch(console.log);
