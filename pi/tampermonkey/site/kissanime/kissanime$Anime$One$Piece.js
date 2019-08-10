new EvalScript('', {
    run: async () => {
        const links = [...document.querySelectorAll('.listing a')];
        for(let link of links) {
            if(link.textContent
                .trim()
                .includes('Episode 895')) {
                link.parentElement.innerHTML += '<span style="color:green;">--- LAST --- </span>';
                break;
            }
        }
    }

});