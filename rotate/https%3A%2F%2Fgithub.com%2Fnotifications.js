new EvalScript('', {
    run: async (resolv, set) => {
        set.div = document.createElement('div');
        set.div.textContent = 'abc ';
        document.body.appendChild(set.div);
    }
    , reset: (set) => {
        set.div.remove();
        console.log('reset git22');
    }
});