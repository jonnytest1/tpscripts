///<reference path="../../customTypes/index.d.ts" />
///<reference path="../../DOM/CircularMenu.js" />
/**
* @typedef PHPTest
* @property {"success"|"error"|"skipped"|"failed"} success;
* @property {string} [message]
* @property {string} [stack]
* @property {string} name
*/
new EvalScript('', {
    run: async () => {

        function getColor(success) {
            let color = 'green';
            switch(success) {
                case 'error':
                case 'failed':
                    color = 'red';
                    break;
                case 'skipped':
                    color = 'gray';
                    break;
                case 'success':
                    color = 'green';
                    break;
                default:
                    color = 'black';
            }
            return color;
        }
        function addResults(tests) {
            sc.menu.addToMenu({
                name: 'test-case',
                children: tests.map(/**@returns { MenuElementItem } */test => {
                    let color = getColor(test.success);

                    return {
                        mouseOver: runSingleTest(test),
                        name: test.name,
                        normalColor: color
                    };

                })
            }, li => li.find(el => el.name === 'test'));
        }

        function runSingleTest(test) {
            return (e, button) => {
                (async () => {
                    const http = await reqS('http');
                    const resp = await http.http('GET', `${window.backendUrl}/test/php/index.php?test=` + encodeURIComponent(test.name));
                    /**@type {PHPTest} */
                    const testResult = resp[0];
                    button.menuOption.normalColor = getColor(testResult.success);
                    button.menuOption.element.style.backgroundColor = getColor(testResult.success);
                })();
            };

        }

        function runAllTests() {
            reqS('http')
                .then(t => t.http('GET', `${window.backendUrl}/test/php/index.php`))
                .then(/**@param {Array<PHPTest>} tests */async tests => {
                    let errorString = '';
                    let green = true;
                    for(let test of tests) {
                        if(test.success !== 'success') {
                            if(test.success === 'skipped') {
                                console.log('skipped ' + test.name);
                                continue;
                            }
                            green = false;
                            errorString += `failed1 TEST:${test.message}\n${test.stack}\n\n`;
                            await reqS('notification')
                                .then(n => n.gmNot(`${location.origin} ` + test.message, test.stack, undefined, () => {
                                    console.log(errorString);
                                    GM_setClipboard(errorString);
                                }));
                        }
                    }
                    addResults(tests);
                });
        }

        sc.menu.addToMenu({
            name: 'test',
            isValid: () => true,
            onclick: runAllTests
        });

    },
    reset: () => {
        sc.menu.removeByName('test');
    }
});