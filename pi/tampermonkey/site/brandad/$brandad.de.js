
///<reference path="../../libs/eval-script.js" />
/**
 * @type {EvalScript<{container:HTMLElement,dialog:Dialog}>}
 */
var b = new EvalScript('', {
    // @ts-ignore
    run: async (re, set) => {

        function shouldRun() {
            if(!location.origin.includes('localhost')
                && !location.origin.includes('.test.brandad.de')
                && !location.origin.includes('.livekopie.brandad.de')
                && !location.origin.includes('.abnahme.brandad.de')) {
                console.error('disabled spider origin match');
                return false;
            }

            if(!location.href.includes('brandbase')
                && !location.href.includes('mios')
                && !location.href.includes('audi')
                && !location.href.includes('dsv')
                && !location.href.includes('allianz')
                && !location.href.includes('mr')
                && !location.href.includes('cdag')) {
                console.error('disabled spider customer match');
                return false;
            }
            console.log('spider enabled');
            return true;
        }
        if(!shouldRun()) {
            return;
        }
        await reqS('site/brandad/spider');
        await reqS('site/brandad/main');
        const testMode = await reqS('site/brandad/integrationtest');
        testMode();

    }, reset: (data) => {
        if(data.container) {
            data.container.remove();
        }
    }
});