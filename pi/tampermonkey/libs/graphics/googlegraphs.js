/// <reference path="../../customTypes/index.d.ts" />
/**
 *
 * @type {{type:EvalScript<{}>}}
 */
var googlegraphs = new EvalScript('', {
    async: true,
    run: async (resolv, set) => {

        if(!document.head.querySelector('#googlechatsscript')) {
            const chartLoaderSc = document.createElement('script');
            chartLoaderSc.id = 'googlechatsscript';
            chartLoaderSc.src = 'https://www.gstatic.com/charts/loader.js';
            document.head.appendChild(chartLoaderSc);
            chartLoaderSc.onload = onload;
        } else {
            onload();
        }

        function onload() {
            // @ts-ignore
            google.charts.load('current', { 'packages': ['corechart'] });
            // @ts-ignore
            google.charts.setOnLoadCallback(() => {
                // @ts-ignore
                resolv({ google });
            });
        }

        return true;

    },
    reset: (set) => {
        //
    }
});