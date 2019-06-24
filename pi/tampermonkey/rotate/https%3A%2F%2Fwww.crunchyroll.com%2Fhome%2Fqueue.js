/// <reference path="../customTypes/index.d.ts" />

new EvalScript('', {
    run: async () => {
        function rek(array = sc.g('queue-item'), index = 0) {
            if (index < array.length) {
                let i = array[index];
                let videoElement = sc.g('episode-progress', i);
                if (videoElement.style.width.replace('%', '') - 0 < 1) {
                    open(sc.g('episode', i).href);
                    setTimeout(rek, 500, array, index + 1);
                }
                else {
                    rek(array, index + 1);
                }
            }
        }
        setTimeout(rek, 2000);
    }
});
