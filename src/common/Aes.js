//引入crypto-js
const CryptoJS = require('crypto-js');

//十六位十六进制数作为密钥（秘钥为随机生成，必须与后端保持一致！）
const key = CryptoJS.enc.Utf8.parse("AiCS_Sprint6_key"); 
//十六位十六进制数作为密钥偏移量（秘钥为随机生成，必须与后端保持一致！）
const iv = CryptoJS.enc.Utf8.parse('AiCS_Sprint6_key'); 

//解密方法
function Decrypt(word) {
    // 先将 Base64 还原一下, 因为加密的时候做了一些字符的替换
    const restoreBase64 = word.replace(/\-/g,'+').replace(/_/g,'/');
    // 这里 mode, padding, iv 一定要跟加密的时候完全一样
    // 返回的是一个解密后的对象
    let decrypt = CryptoJS.AES.decrypt(restoreBase64, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 将解密对象转换成 UTF8 的字符串
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    // 返回解密结果
    return decryptedStr.toString();
}

//加密方法
function Encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    /**
     * CipherOption, 加密的一些选项:
     *   mode: 加密模式, 可取值(CBC, CFB, CTR, CTRGladman, OFB, ECB), 都在 CryptoJS.mode 对象下
     *   padding: 填充方式, 可取值(Pkcs7, AnsiX923, Iso10126, Iso97971, ZeroPadding, NoPadding), 都在 CryptoJS.pad 对象下
     *   iv: 偏移量, mode === ECB 时, 不需要 iv
     * 	返回的是一个加密对象
     */
    let encrypted = CryptoJS.AES.encrypt(srcs, key,
        {
            iv: iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    //将结果进行base64加密
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export {Decrypt , Encrypt}