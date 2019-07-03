///<reference path="../../customTypes/index.d.ts"/>
new EvalScript('', {
    run: async (finisher) => {

        navigator.serviceWorker.register('/tampermonkey/libs/serviceworker/worker')
            .then(
                (s) => {
                    debugger;
                },
                (reason) => {
                    debugger;
                }
            );
        return true;
    }
});