
/// <reference path="../customTypes/index.d.ts" />
new EvalScript('', {
    run: async (res, set) => {

        const orginalLog = console.log;
        console.log = (...args) => {
            try {
                window['undefined'].stacktrace();
            } catch(e) {
                try {
                    if(sc.G) {
                        const logLevels = sc.G.g('LogLevel', { general: 'INFO' });
                        orginalLog(...args);
                    }

                } catch(e) {
                    orginalLog(e);
                    orginalLog(...args);
                }
            }

        };
    }
});