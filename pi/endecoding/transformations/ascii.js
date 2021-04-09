
/// <reference path="../endecoding.d.ts" />

/**@type {Array<Encoding>} */
var ascii = [
    {
        nameHTML: 'string digit to ascii number',
        fnc: str => str.split('')
            .map(c => c.charCodeAt(0))
            .join(' ')
    },
    {
        nameHTML: 'ascii number to string',
        fnc: str => {
            let t = '';
            let ar = str.split('');
            for(let i = 0; i < ar.length; i += 2) {
                if(+ar[i] < 3) {
                    t += String.fromCharCode((+ar[i] * 100) + (+ar[i + 1] * 10) + ((+ar[i + 2]) * 1));
                    i++;
                } else {
                    t += String.fromCharCode(+ar[i] * 10) + (+ar[i + 1] | 0);
                }
            }
            return t;
        }
    },
    {
        nameHTML: 'ascii digit to string',
        fnc: str => {
            return str.split('')
                .map(c => String.fromCharCode(Number(c)))
                .join('');
        }
    },
];

export default ascii;