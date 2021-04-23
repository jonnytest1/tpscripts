
/// <reference path="./textOutput.js" />
/// <reference path="./parameter.js" />

import { encodings } from './codings';
import { Parameter } from './parameter';
import { TextOutput } from './textOutput';

/**
 *
 * @param {string} text
 * @param {number} amount
 */
function recreate(text, amount) {

    if(!text || !amount) {
        return;
    }

    /**@type {HTMLElement} */

    [...document.querySelectorAll('tr')]
        // @ts-ignore
        .flatMap(tr => [...tr.childNodes])
        .filter(td => td.className !== 'default')
        .forEach(node => node.remove());

    let previousText = text;

    /**@type {Array<TextOutput>} */
    let outputs = [];
    for(let i = 0; i < amount; i++) {
        const encodingRef = queryPicked[i] ? queryPicked[i].valueOf() : 0;
        let pickedConverter;
        if(isNaN(+encodingRef)) {
            pickedConverter = encodings.find(encoding => encoding.key === encodingRef);
        } else {
            pickedConverter = encodings[+encodingRef];
        }
        let output = new TextOutput(pickedConverter, i, queryPicked);

        if(outputs.length > 0) {
            previousText = outputs[outputs.length - 1].convertedText;
            outputs[outputs.length - 1].next = output;
        } else {
            previousText = text;
        }
        output.setPrevious(previousText, outputs[outputs.length - 1]);
        output.addElements(updateUrl);

        outputs.push(output);

    }
    // outputs[0].recalculate();
}
function updateUrl() {
    let amountValue = amountInput.value;
    const textValue = textInput.value;
    const matcherValue = matcherInput.value;

    let url = new URL(location.origin + location.pathname);

    if(amountValue) {
        url.searchParams.append('amount', amountValue);
    }
    if(textValue) {
        url.searchParams.append('text', textValue);
    }
    if(matcherValue) {
        url.searchParams.append('matcher', matcherValue);

    }
    for(let t in queryPicked) {
        if(!amountValue || +t < +amountValue) {
            url.searchParams.append(`${[t]}`, `${queryPicked[t]}`);
        }
    }

    window.history.pushState(undefined, '', url.href);
}

const currentUrl = new URL(location.href);

/**@type {Array<Parameter>} */
let queryPicked = [];
for(let i = 0; i < 50; i++) {
    const key = `${i}`;
    if(currentUrl.searchParams.has(key)) {
        const iVal = currentUrl.searchParams.get(key);
        queryPicked[i] = new Parameter(i, iVal);

    }
}
/**@type {HTMLInputElement} */
let textInput = document.querySelector('#textInput');
/**@type {HTMLInputElement} */
const amountInput = document.querySelector('#amount');
/**@type {HTMLInputElement} */
const matcherInput = document.querySelector('#matcher');
/**@type {HTMLImageElement} */
let loadingImage = document.querySelector('#loadingImage');
//finc encoding with criteria
//just brute forces all the combinations
/*matcherInput.onkeypress = (e) => {
    if(e.charCode === 13) {
        let evaluater = eval(e.target.value);
        matcherValue = encodeURIComponent(evaluater);
        updateUrl();
        let startText = textValue;

        let possibleCombinations = [];

        e.target.backgroundColor = 'orange';
        function iterateEncodings(text, index, combinations) {
            let found = false;

            if(index == 0) {
                if(evaluater(text)) {
                    found = true;
                    //alert(combinations+"\n"+text);
                    if(!possibleCombinations.includes(text)) {
                        possibleCombinations.push(text);
                        console.log(combinations + '\n' + text);
                    }
                }
            } else {
                for(let l = 0; l < encodings.length; l++) {
                    try {
                        if(iterateEncodings(encodings[l].fnc(text), index - 1, combinations + ' ' + l)) {
                            found = true;
                        }
                    } catch(e) {
                    }
                }
            }
            return found;
        }

        let found = false;
        for(let i = 0; i < amountValue; i++) {
            console.log('iterating ' + i + '/' + amountValue);
            if(iterateEncodings(startText, i, '')) {
                found = true;
            }
        }
        if(found) {
            alert(possibleCombinations.length + ' combinations found details in console');
        }
        e.target.backgroundColor = 'white';
    }

};*/

(function setInitVariables() {
    let amountValue = currentUrl.searchParams.has('amount') ? +currentUrl.searchParams.get('amount') : 1;
    let textValue = currentUrl.searchParams.has('text') ? currentUrl.searchParams.get('text') : undefined;
    let matcherValue = currentUrl.searchParams.has('matcher') ? currentUrl.searchParams.get('matcher') : undefined;

    amountInput.value = '' + amountValue || '1';
    if(textValue) {
        textInput.value = textValue;
    }

    amountInput.oninput = (e) => {
        amountValue = +amountInput.value;
        recreate(textValue, amountValue);
        updateUrl();
    };
    let inputTimeout;
    textInput.oninput = (e) => {
        if(queryPicked.some(q => q.yIndex.includes('aes'))) {
            if(inputTimeout) {
                clearTimeout(inputTimeout);
            }
            inputTimeout = setTimeout(() => {
                loadingImage.style.visibility = 'visible';
                setTimeout(() => {
                    inputTimeout = undefined;
                    textValue = textInput.value;
                    recreate(textValue, amountValue);
                    updateUrl();
                    loadingImage.style.visibility = 'hidden';
                }, 10);
            }, 500);
        } else {
            textValue = textInput.value;
            recreate(textValue, amountValue);
            updateUrl();
        }
    };

    if(matcherInput.value) {
        matcherInput.value = matcherValue;
    }
    recreate(textValue, amountValue);

})();

export { queryPicked, updateUrl };
