new EvalScript('', {
    run: async () => {
        const video = document.querySelector('video');
        document.querySelector('#container').outerHTML = `<video src="${video.src}"></video>`;
        const other = await reqS('Videos/automation');
        if(document.querySelector('#container').children[1].textContent === 'File Not Found') {
            other();
        }

    }
});