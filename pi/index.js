
function swTest() {
    if(!window['swTest']) {
        return;
    }
    navigator.serviceWorker.register('/tampermonkey/libs/serviceworker/worker.js', { scope: '/' })
        .then(
            (s) => {
                Notification.requestPermission((status) => {
                    console.log('Notification permission status:', status);
                    //navigator.serviceWorker.controller.postMessage('notify');
                });
            },
            (reason) => {
                debugger;
            }
        );
}
