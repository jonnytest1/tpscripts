new EvalScript('', {
    run: async () => {
        const other = await reqS('Videos/automation');
        if(document.querySelector('#container').children[1].textContent === 'File Not Found') {
            other();
        }
    }
});