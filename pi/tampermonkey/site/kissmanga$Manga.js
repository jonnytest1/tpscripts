///<reference path="../libs/eval-script.js" />
new EvalScript('', {
    run: async (res, set) => {
        const imgs = [...document.querySelectorAll('#divImage img')];

        imgs.forEach((el) =>
            el.addEventListener('click', () => {
                try {
                    /**@type HTMLElement */
                    const nextButton = document.querySelector('.btnNext');
                    nextButton.click();
                } catch(err) {
                    //
                }
            })
        );
    }
});