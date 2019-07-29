///<reference path="index.js"/>
///<reference path="codings.js"/>
/**
 * @typedef {HTMLElement &{
 *  converter?:Encoding
 *  onclick?:(any)=>any
 *  index?:number;
 *  val?:any
 * }} HTMLConvElement
 *
 * @callback Click
 *
 */
class TextOutput {

    /**
     *
     * @param {Encoding} converter
     */
    constructor(converter, index) {
        this.next = null;
        this.converter = converter;
        this.encodings = getEncodings();
        this.conversionElements = [];
        this.index = index;
    }

    /**
     *
     * @param {string} previousText
     * @param {TextOutput} previous
     */
    setPrevious(previousText, previous) {
        this.previousText = previousText;
        this.previous = previous;
    }

    convert(str) {
        if(str === 'ERROR') {
            return 'ERROR';
        }
        try {
            this.convertedText = this.converter.fnc(str, this.conversionElement);
            return this.convertedText;
        } catch(e) {
            console.trace(e, str, this.converter);
            return 'ERROR';
        }
    }
    recalculate() {
        let value = this.convert(this.previousText);
        try {
            this.textField.value = JSON.stringify(JSON.parse(value), undefined, '. ');
        } catch(error) {
            this.textField.value = value;
        }
        if(this.next) {
            this.next.previousText = value;
            this.next.recalculate(this.next);
        }
    }

    printAll() {
        console.log(`------ starting print for ${this.previousText} ------`);
        for(let element of this.encodings) {
            try {
                let converted = element.fnc(this.previousText, this.conversionElement);
                console.log(converted);
            } catch(e) {
                console.log('ERROR', e, this.previousText, this.converter);
            }
        }
        console.log(`------ finished print for ${this.previousText} ------`);
    }

    addElements() {
        const convRow = document.querySelector('#encodingSelectors');
        const newConvList = getDefault(convRow);
        this.conversionElements = [];
        for(let j = 0; j < this.encodings.length; j++) {
            const converter = this.encodings[j];
            const convList = newConvList.querySelector('.converterList');
            /**@type {HTMLConvElement} */
            const newConvElement = getDefault(convList);
            newConvElement.textContent = converter.name;
            newConvElement.converter = converter;
            newConvElement.index = j;
            newConvElement.onclick = (e) => {
                /**@type {HTMLConvElement} */
                let element = e.target;
                this.conversionElements.forEach(el => el.style.backgroundColor = '');
                element.style.backgroundColor = 'lightBlue';

                this.converter = element.converter;
                this.conversionElement = element;

                if(element.converter.onchoose) {
                    const cutomValue = element.converter.onchoose(queryPicked[this.index].value);
                    newConvElement.val = cutomValue;
                    Parameter.setIndex(this.index, element.index, cutomValue);
                }
                Parameter.setIndex(this.index, element.index);
                this.recalculate();
                updateUrl();
            };

            if(j === 0 && !queryPicked[this.index]) {
                newConvElement.style.backgroundColor = 'lightBlue';
                this.conversionElement = newConvElement;
                this.converter = converter;
                //tslint:disable-next-line
            } else if(queryPicked[this.index] && queryPicked[this.index].valueOf() == j) {
                this.converter = converter;
                this.conversionElement = newConvElement;
                newConvElement.val = queryPicked[this.index].value;
                newConvElement.style.backgroundColor = 'lightBlue';
            }
            this.conversionElements.push(newConvElement);
            convList.appendChild(newConvElement);
        }
        convRow.appendChild(newConvList);

        const textRow = document.querySelector('#textFields');
        const newRow = getDefault(textRow);
        /**@type {HTMLInputElement} */
        const textDisplay = newRow.querySelector('.textDisplay');
        const converted = this.convert(this.previousText);
        try {
            textDisplay.value = JSON.stringify(JSON.parse(converted), undefined, '. ');
        } catch(error) {
            textDisplay.value = converted;
        }
        this.textField = textDisplay;
        textRow.appendChild(newRow);

        const printRow = document.querySelector('#printButtons');
        const newPrintElement = getDefault(printRow);
        /**@type {HTMLButtonElement} */
        const button = newPrintElement.querySelector('.printAll');
        button.onclick = () => {
            this.printAll();
        };
        printRow.appendChild(newPrintElement);
    }

}
/**
 * @param {Element} node
 * @returns {HTMLElement}
 **/
function getDefault(node) {

    /**@type {HTMLElement} */
    // @ts-ignore
    const newNode = node.querySelector('.default')
        .cloneNode(true);
    newNode.classList.remove('default');
    return newNode;
}