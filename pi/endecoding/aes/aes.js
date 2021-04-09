/// <reference path="cryptojs.d.ts" />
/// <reference path="../endecoding.d.ts" />

/**@type {Array<Encoding>} */
var aes = [
    {
        nameHTML: 'aes encrypt',
        key: 'aesenc',
        onchoose: queryValue => prompt('aes secret', queryValue || ''),
        fnc: function(str, out) {
            let secret = out.val;
            out.textContent = `${this.nameHTML}: ${secret}`;
            let encrypted = CryptoJS.AES.encrypt(str, secret);
            return encrypted.toString();
        }
    }, {
        nameHTML: 'aes decrypt',
        key: 'aesdec',
        onchoose: queryValue => prompt('aes secret', queryValue || ''),
        fnc: function(str, out) {
            let secret = out.val;
            out.textContent = `${this.nameHTML}: ${secret}`;
            let code = CryptoJS.AES.decrypt(str, secret);
            const result = code.toString(CryptoJS.enc.Utf8);
            if(!result) {
                throw 'couldnt decrypt';
            }
            return result;
        }
    }
];

export default aes;