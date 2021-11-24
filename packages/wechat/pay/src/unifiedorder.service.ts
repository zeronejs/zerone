import { Inject, Injectable } from '@nestjs/common';
import { UnifiedTransactionsRequestParams } from './unifiedorder.types';
import axios from 'axios';
import { randomChars } from '@zeronejs/utils';
import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { KJUR, hextob64 } from 'jsrsasign';
import { WechatPayApiHostname, WechatPayBaseOptions } from './constants';
import { WechatPayModuleOptions } from './wechatPay.module';

@Injectable()
export class WechatPayUnifiedorderService {
    constructor(
        @Inject(WechatPayApiHostname) private readonly baseUrl: string,
        @Inject(WechatPayBaseOptions) private readonly baseOptions: WechatPayModuleOptions
    ) {}
    async jsapi(params: UnifiedTransactionsRequestParams) {
        this.baseOptions.private_key = readFileSync(join(__dirname, './rsa/rsa_private_key.pem')).toString();
        const url = {
            method: 'POST',
            pathname: '/v3/pay/transactions/jsapi',
        };
        const onece_str = randomChars();
        const bodyParamsStr = JSON.stringify(params);
        const timestamp = Math.floor(Date.now() / 1000);

        const signature = this.rsaSign(
            `${url.method}\n${url.pathname}\n${timestamp}\n${onece_str}\n${bodyParamsStr}\n`,
            this.baseOptions.private_key
        );
        console.log(signature);
        const Authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${params.mchid}",nonce_str="${onece_str}",timestamp="${timestamp}",signature="${signature}",serial_no="${this.baseOptions.serial_no}"`;
        return axios.post(this.baseUrl + url.pathname, params, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: Authorization,
            },
        });
    }
    /**
     * rsa签名
     * @param content 签名内容
     * @param privateKey 私钥，PKCS#1
     * @param hash hash算法，SHA256withRSA，SHA1withRSA
     * @returns 返回签名字符串，base64
     */
    rsaSign(content: string, privateKey: any, hash = 'SHA256withRSA') {
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
}
