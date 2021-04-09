///<reference path="index.js"/>
import aes from './aes/aes';
import hashes from './hashes/hashes';
import ascii from './transformations/ascii';
import base64 from './transformations/base64';
/**
 * @returns {Array<Encoding>}
 */
function getEncodings() {
    /**@type {Array<Encoding>} */
    let encs = [
        ...ascii,
        ...base64,
        ...aes,
        ...hashes,
        {
            nameHTML: 'urlencode',
            key: 'urlenc',
            fnc: encodeURIComponent
        }, {
            nameHTML: 'urldecode',
            key: 'urldec',
            fnc: decodeURIComponent
        }, {
            nameHTML: 'jwt',
            key: 'jwt',
            fnc: str => {
                const nStr = str.split('.')[1];
                const base64Str = nStr.replace(/-/g, '+')
                    .replace(/_/g, '/');
                return decodeURIComponent(atob(base64Str)
                    .split('')
                    .map(c => {
                        return '%' + ('00' + c.charCodeAt(0)
                            .toString(16))
                            .slice(-2);
                    })
                    .join(''));
            }
        }, {
            nameHTML: 'json parse',
            fnc: str => JSON.parse(str)
        }, {
            nameHTML: 'stack format',
            fnc: str => {
                const obj = JSON.parse(str);
                obj.stack_trace = obj.stack_trace.replace(/\r\n/g, '<line--break>')
                    .replace(/\n/g, '<line--break>')
                    .replace(/\t/g, '<line--tab>');
                const jsonStr = JSON.stringify(obj, undefined, '. ');
                return jsonStr
                    .replace(/<line--break>/g, '\n')
                    .replace(/<line--tab>/g, '\t');
            }
        }, {
            nameHTML: 'custom',
            onchoose: queryValue => {
                return prompt('write a function that returns a string', queryValue || 'str => ');
            },
            fnc: (str, out) => {
                let evl = out.val;
                out.textContent = 'custom :' + evl;
                let newStr = eval(evl)(str);
                return newStr;
            }
        }, {
            nameHTML: 'regex',
            onchoose: queryValue => {
                return prompt('write a matcher string', queryValue || '')
                    .replace(/\\n/gm, '\n');
            },
            fnc: (str, out) => {
                let stringMatch = out.val;
                out.textContent = 'regex :' + stringMatch;

                const regexp = new RegExp(stringMatch, 'gm');
                let match;
                const matches = [];
                while((match = regexp.exec(str)) !== null) {
                    matches.push({
                        index: match.index,
                        matches: [...match],
                        groups: match.groups
                    });
                }

                return JSON.stringify(matches);
            }
        }, {
            nameHTML: 'path',
            fnc: str => {
                if(str.includes('\\\\')) {
                    return str.replace(/\\\\/g, '\\');
                } else {
                    return str.replace(/\\/g, '\\\\');
                }
            }
        }
    ];
    for(let i = 2; i < 37; i++) {
        if(i === 10) {
            continue;
        }
        encs.push({
            nameHTML: i + ' to dec',
            fnc: str => {
                return str.split(' ')
                    .map(sstr => '' + parseInt(sstr, i)
                    )
                    .join(' ');
            }
        });
        encs.push({
            nameHTML: 'dec to ' + i,
            fnc: str => {
                // @ts-ignore
                return str.split(' ')
                    .map(sstr => parseInt(sstr, 10)
                        .toString(i)
                        .toUpperCase())
                    .join(' ');

            }
        });
    }
    return encs;
}
const encodings = getEncodings();
export { encodings };