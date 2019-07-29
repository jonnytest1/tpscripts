
/// <reference path="./textOutput.js" />
/// <reference path="./parameter.js" />
/**
 * @typedef Encoding
 * @property {string} name
 * @property {(str:string,output?:HTMLConvElement)=>string} fnc;
 * @property {(queryValue:any)=>string} [onchoose]
 *
 **/

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

        const pickedConverter = getEncodings()[queryPicked[i] ? queryPicked[i].valueOf() : 0];
        let output = new TextOutput(pickedConverter, i);

        if(outputs.length > 0) {
            previousText = outputs[outputs.length - 1].convertedText;
            outputs[outputs.length - 1].next = output;
        } else {
            previousText = text;
        }
        output.setPrevious(previousText, outputs[outputs.length - 1]);
        output.addElements();

        outputs.push(output);

    }
    // outputs[0].recalculate();
}
function updateUrl() {
    let amountValue = amountInput.value;
    const textValue = textInput.value;
    const matcherValue = matcherInput.value;

    let url = location.href.split('?')[0];

    let hasPushedQ = false;
    if(amountValue) {
        if(!hasPushedQ) {
            hasPushedQ = true;
            url += '?';
        } else {
            url += '&';
        }
        url += 'amount=' + amountValue;
    }
    if(textValue) {
        if(!hasPushedQ) {
            hasPushedQ = true;
            url += '?';
        } else {
            url += '&';
        }
        url += 'text=' + textValue;
    }
    if(matcherValue) {
        if(!hasPushedQ) {
            hasPushedQ = true;
            url += '?';
        } else {
            url += '&';
        }
        url += 'matcher=' + matcherValue;
    }
    for(let t in queryPicked) {
        if(!hasPushedQ) {
            hasPushedQ = true;
            url += '?';
        } else {
            url += '&';
        }
        url += `${[t]}=${queryPicked[t]}`;
    }

    window.history.pushState(undefined, '', url);
}
/**@type {Array<Parameter>} */
let queryPicked = [];
for(let i = 0; i < 50; i++) {
    if(location.search.includes(i + '=')) {
        const iVal = location.search.split(i + '=')[1]
            .split('&')[0];

        queryPicked[i] = new Parameter(i, iVal);

    }
}
/**@type {HTMLInputElement} */
let textInput = document.querySelector('#textInput');
/**@type {HTMLInputElement} */
const amountInput = document.querySelector('#amount');
/**@type {HTMLInputElement} */
const matcherInput = document.querySelector('#matcher');

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
    let amountValue = location.search.includes('amount=') ? +location.search.split('amount=')[1]
        .split('&')[0] : 1;
    let textValue = location.search.includes('text=') ? location.search.split('text=')[1]
        .split('&')[0] : undefined;
    let matcherValue = location.search.includes('matcher=') ? decodeURIComponent(location.search.split('matcher=')[1]
        .split('&')[0]) : undefined;

    amountInput.value = '' + amountValue || '1';
    if(textValue) {
        textInput.value = textValue;
    }

    amountInput.oninput = (e) => {
        amountValue = +amountInput.value;
        recreate(textValue, amountValue);
        updateUrl();
    };

    textInput.oninput = (e) => {
        textValue = textInput.value;
        recreate(textValue, amountValue);
        updateUrl();
    };

    if(matcherInput.value) {
        matcherInput.value = matcherValue;
    }
    recreate(textValue, amountValue);

})();
