import { KJUR, hextob64 } from 'jsrsasign';

/**
 * rsa签名
 * @param content 签名内容
 * @param privateKey 私钥，PKCS#1
 * @param hash hash算法，SHA256withRSA，SHA1withRSA
 * @returns 返回签名字符串，base64
 */
export function rsaSign(content: string, privateKey: string, hash = 'SHA256withRSA') {
    // 创建 Signature 对象
    const signature = new KJUR.crypto.Signature({
        alg: hash,
        // //!这里指定 私钥 pem!
        // prvkeypem: privateKey,
    });
    signature.init(privateKey);
    signature.updateString(content);
    const signData = signature.sign();
    // 将内容转成base64
    return hextob64(signData);
}
