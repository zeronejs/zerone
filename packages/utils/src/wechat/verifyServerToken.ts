import { createHash } from 'crypto';

export interface WechatVerifyServerTokenInput {
    signature: string;
    timestamp: string;
    nonce: string;
    echostr: string;
    // 你配置的token
    token: string;
}
/**
 * 验证服务器Token
 * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html
 */
export function wechatVerifyServerToken(params: WechatVerifyServerTokenInput) {
    const { signature, timestamp, nonce, echostr, token } = params;
    const hash = createHash('sha1');
    const arr = [token, timestamp, nonce].sort();
    hash.update(arr.join(''));
    const shasum = hash.digest('hex');
    if (shasum === signature) {
        return echostr;
    }
    return 'error';
}