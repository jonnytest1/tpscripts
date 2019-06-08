/// <reference path="../DOM/button.js" />


(function checkEnv() {
    try {
        // @ts-ignore
        let env = jasmine.getEnv();
        let exec = env.execute;
        env.execute = (a, b) => {
            //debugger;
            // @ts-ignore
            if (b == true) {
                exec(a);
            }

        }
    } catch (e) {
        if (e.message == "jasmine is not defined") {
            setTimeout(checkEnv, 1);
        } else {
            throw e;
        }

    }
})();

/**
 * 
 * @param {*} suite 
 * @param {boolean} [onlyFailed]
 * 
 * @returns {RectMenuElement&{passed:boolean}} 
 */
function parseSuite(suite, onlyFailed = false) {
    let testGroups = [];
    let hasFailed = false;
    for (let suiteElement of suite.children) {
        if (suiteElement.constructor.name == "Spec") {
            let passed = suiteElement.result.status == "passed";
            if (!passed || !onlyFailed) {
                hasFailed = true;
                testGroups.push({
                    buttonCustomizer: customAdd,
                    passed: passed,
                    name: suiteElement.description
                })
            }
        } else {
            let subSuite = parseSuite(suiteElement, onlyFailed);
            if (!subSuite.passed || !onlyFailed) {
                hasFailed = true;
                testGroups = [...testGroups, subSuite];
            }
        }
    }
    return {
        buttonCustomizer: customAdd,
        name: suite.description,
        passed: !hasFailed,
        children: testGroups
    }
}

function getSuite() {
    return jasmine.getEnv().topSuite();
}

async function runSuite(suite, menuFilter) {
    if (suite.beforeAllFns) {
        for (let fnc of suite.beforeAllFns) {
            await fnc();
        }
    }
    for (let subSuite of suite.children) {

        if (suite.beforeFns) {
            for (let fnc of suite.beforeFns) {
                await fnc.fn();
            }
        }

        if (subSuite.constructor.name == "Spec") {

            console.log(subSuite.execute());
        } else {
            runSuite(subSuite);
        }
    }
}

function runTests(menu) {
    let symbolsContainer = document.getElementsByClassName("symbol-summary")[0];
    for (let i = symbolsContainer.children.length - 1; i >= 0; i--) {
        symbolsContainer.children[i].remove();
    }
    let resContainer = document.getElementsByClassName("results")[0];
    for (let i = resContainer.children.length - 1; i >= 0; i--) {
        resContainer.children[i].remove();
    }

    let suite = getSuite();
    debugger;
    runSuite(suite, menu);


}


function customAdd(btn) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.cssFloat = "right";
    btn.appendChild(checkbox);
}


/**
 * 
 * @param {MenuHTMLElement} btn 
 */
function mainMenuCustomizer(btn) {
    let run = document.createElement("button");
    run.style.cssFloat = "left";
    run.textContent = "play";
    run.onclick = () => runTests(btn.menu);
    btn.appendChild(run);
}


Menu.init().then(() => {
    if (window.self !== window.top) {
        const menu = new Menu({
            parent: document.body,
            control: {
                width: 200,
                name: "ctrl",
                children: [{
                    name: "save",
                    click: () => {
                        let suite = getSuite()
                        menu.addToMenu({
                            buttonCustomizer: mainMenuCustomizer,
                            name: "saved",
                            children: parseSuite(suite).children,
                        })
                    }
                }, {
                    name: "saveFailed",
                    click: () => {
                        let suite = getSuite()
                        menu.addToMenu({
                            name: "saved",
                            buttonCustomizer: mainMenuCustomizer,
                            children: parseSuite(suite, true).children,
                        })
                    }
                }]
            }
        })
        /*  menu.addToMenu([{
              name: "test",
              children: [
                  { name: "test1" },
                  { name: "test1" },
                  { name: "test1" }
              ]
          },
          {
              name: "test"
          }]);*/
    }
})