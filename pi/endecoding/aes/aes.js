/// <reference path="node-forge.d.ts" />
/// <reference path="../endecoding.d.ts" />

/**@type {Array<Encoding>} */
var aes = [
    {
        nameHTML: 'aes encrypt',
        key: 'aesenc',
        onchoose: queryValue => prompt('aes secret', queryValue || ''),
        fnc: function(str, out) {

            var iv = forge.random.getBytesSync(12);

            var salt = forge.random.getBytesSync(16);
            let secret = out.val;
            var key = forge.pkcs5.pbkdf2(secret, salt, 65536, 32, 'sha256');
            out.textContent = `${this.nameHTML}: ${secret}`;
            const cipher = forge.cipher.createCipher('AES-GCM', key);
            cipher.start({
                iv: iv,
                tagLength: 128 // optional, defaults to 128 bits
            });
            cipher.update(forge.util.createBuffer(str));

            cipher.finish();
            const encrypted = cipher.output;

            const tag = cipher.mode.tag;

            const encryptedBuffer = forge.util.createBuffer(iv)
                .putBytes(salt)
                .putBytes(encrypted.data)
                .putBytes(tag.data);
            const encodedB64 = forge.util.encode64(encryptedBuffer.data);

            return encodedB64;
        }
    }, {
        nameHTML: 'aes decrypt',
        key: 'aesdec',
        onchoose: queryValue => prompt('aes secret', queryValue || ''),
        fnc: function(str, out) {
            let secret = out.val;
            out.textContent = `${this.nameHTML}: ${secret}`;
            function base64ToArrayBuffer(base64) {
                var binaryString = window.atob(base64);
                var len = binaryString.length;
                var bytes = new Uint8Array(len);
                for(var i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes.buffer;
            }

            const byteBuffer = base64ToArrayBuffer(str);

            const ivBuffer = byteBuffer.slice(0, 12);
            const forgeIvBuffer = forge.util.createBuffer(ivBuffer);

            const saltBuffer = byteBuffer.slice(12, 28);
            const forgeSaltBuffer = forge.util.createBuffer(saltBuffer);

            const cipherBuffer = byteBuffer.slice(28, byteBuffer.byteLength - 16);
            const forgeCipherBuffer = forge.util.createBuffer(cipherBuffer);

            const tagBuffer = byteBuffer.slice(byteBuffer.byteLength - 16, byteBuffer.byteLength);
            const forgeTagBuffer = forge.util.createBuffer(tagBuffer);

            var key = forge.pkcs5.pbkdf2(secret, forgeSaltBuffer.data, 65536, 32, 'sha256');

            var decipher = forge.cipher.createDecipher('AES-GCM', key);

            decipher.start({
                iv: forgeIvBuffer.data,
                tagLength: 128, // optional, defaults to 128 bits
                tag: forgeTagBuffer.data // authentication tag from encryption
            });
            decipher.update(forgeCipherBuffer);
            var pass = decipher.finish();
            if(pass) {
                return decipher.output.getBytes();
            }
            throw 'couldnt decrypt';
        }
    }
];

export default aes;