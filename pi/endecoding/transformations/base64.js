/// <reference path="../endecoding.d.ts" />
/**@type {Array<Encoding>} */
const ascii = [
    {
        nameHTML: 'base 64 encode',
        key: '64enc',
        fnc: str => {
            return btoa(str);
        }
    },
    {
        nameHTML: 'base 64 decode',
        key: '64dec',
        fnc: str => {
            return atob(str);
        }
    },
];

export default ascii;