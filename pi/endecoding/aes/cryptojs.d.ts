
type Encryption = "utf8"

interface CryptCode {
    toString(charset?: Encryption)
}

interface ICryptoJS {
    AES: {
        encrypt(msg: string, secret: string): CryptCode
        decrypt(msg: string, secret: string): CryptCode
    },
    enc: {
        [key: string]: Encryption
    }
}


declare const CryptoJS: ICryptoJS;