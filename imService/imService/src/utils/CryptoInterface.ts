import * as CryptoJS from "crypto-js"

export interface CrypotoType {
    encrypt: any
    decrypt: any
}

export default class CryptoInterface implements CrypotoType {
    key = CryptoJS.enc.Utf8.parse('fuck56789niufgoj') // 十六位十六进制数作为密钥
    iv = CryptoJS.enc.Utf8.parse('as44ghj123456fuc') // 十六位十六进制数作为密钥偏移量

    /* 加密 */
    encrypt(word: string): Promise<string> {
        return new Promise((resolve) => {
            try {
                const srcs = CryptoJS.enc.Utf8.parse(word)
                const encrypted = CryptoJS.AES.encrypt(srcs, this.key,
                    {
                        iv: this.iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    })
                resolve(encrypted.ciphertext.toString(CryptoJS.enc.Base64))
            } catch (ex) {
                resolve('');
            }
        });
    }

    /* 解密 */
    decrypt(word: string): Promise<string> {
        return new Promise((resolve) => {
            try {
                const encryptedHexStr = CryptoJS.enc.Base64.parse(word)
                const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
                const decrypt = CryptoJS.AES.decrypt(srcs, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
                const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)

                resolve(decryptedStr.toString());
            } catch (ex) {
                resolve('');
            }
        });
    }
}