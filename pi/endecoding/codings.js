///<reference path="index.js"/>
/// <reference path="./hashes/md5.js" />
/// <reference path="./hashes/sha1.js" />
/// <reference path="./hashes/sha256.js" />
/**
 * @returns {Array<Encoding>}
 */
function getEncodings() {
    /**@type {Array<Encoding>} */
    let encodings = [
        {
            name: 'string to ascii number',
            fnc: str =>  str.split('')
                .map(c => c.charCodeAt(0))
                .join('')
        },
        {
            name: 'ascii number to string',
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
            name: 'ascii digit to string',
            fnc: str => {
                return str.split('')
                    .map(c => String.fromCharCode(Number(c)))
                    .join('');
            }
        },
        {
            name: 'base 64 encode',
            fnc: str => {
                return btoa(str);
            }
        },

        {
            name: 'base 64 decode',
            fnc: str => {
                return atob(str);
            }
        },
        {
            name: 'sha1',
            fnc: str => {
                return SHA1(str);
            }
        },
        {
            name: 'sha256',
            fnc: str => {
                return SHA256(str);
            }
        },
        {
            name: 'MD5',
            fnc: str => {
                return MD5(str);
            }
        }, {
            name: 'urlencode',
            fnc: encodeURIComponent
        }, {
            name: 'urldecode',
            fnc: decodeURIComponent
        }, {
            name: 'jwt',
            fnc: str => {
                const nStr = str.split('.')[1];
                const base64 = nStr.replace(/-/g, '+')
                    .replace(/_/g, '/');
                return decodeURIComponent(atob(base64)
                    .split('')
                    .map(c => {
                        return '%' + ('00' + c.charCodeAt(0)
                            .toString(16))
                            .slice(-2);
                    })
                    .join(''));
            }
        }, {
            name: 'json parse',
            fnc: str => JSON.parse(str)
        }, {
            name: 'stack format',
            fnc: str => {
                const obj=JSON.parse(str);
                obj.stack_trace=obj.stack_trace.replace(/\r\n/g,'<line--break>')
                    .replace(/\n/g,'<line--break>')
                    .replace(/\t/g,'<line--tab>');
                const jsonStr = JSON.stringify(obj , undefined, '. ');
                return jsonStr.replace(/<line--break>/g,'\n')
                    .replace(/<line--tab>/g,'\t');
            }
        },  {
            name: 'custom',
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
            name: 'regex',
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
        },{
            name:'path',
            fnc:str=>{
                if(str.includes('\\\\')){
                    return str.replace(/\\\\/g, '\\');
                }else{
                    return str.replace(/\\/g,'\\\\');
                }
            }
        }
    ];
    for(let i = 2; i < 37; i++) {
        if(i === 10) {
            continue;
        }
        encodings.push({
            name: i + ' to dec',
            fnc: str => {
                return '' + parseInt(str, i);
            }
        });
        encodings.push({
            name: 'dec to ' + i,
            fnc: str => {
                // @ts-ignore
                return parseInt(str, 10)
                    .toString(i)
                    .toUpperCase();
            }
        });
    }
    return encodings;
}