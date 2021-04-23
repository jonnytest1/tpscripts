/// <reference path="../customTypes/index.d.ts" />
/**
 * @type {EvalScript<{},unknown>}
 */
var _19216817854 = new EvalScript('', {
    waitForResolver: true,
    run: async (resolv, set) => {
        await reqS('rotate/rotate');

        setInterval(checkNewLogs, 5000);

        async function checkNewLogs() {
            const response = await fetch(`${window.top.backendUrl}/libs/log/newlogs.php`);
            const responseContent = await response.json();
            if(responseContent.affected > 0) {
                open(`${window.top.backendUrl}/libs/log/?count=${responseContent.affected}`);
            }
        }
    },
    reset: (set) => {
        //
    }
});
//tslint:disable-next-line
_19216817854;