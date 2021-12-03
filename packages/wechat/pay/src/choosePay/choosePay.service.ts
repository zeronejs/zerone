import { Inject, Injectable } from '@nestjs/common';
import { randomChars } from '@zeronejs/utils';
import { WechatPayModuleOptions } from '../wechatPay.module';
import { WechatPayBaseOptions } from '../common';

import { rsaSign } from '../common/sign';
import { WechatPayChoosePayServiceJsapiInput, WechatPayChoosePayServiceAppInput } from './choosePay.types';

/**
 * 调起支付参数服务
 */
@Injectable()
export class WechatPayChoosePayService {
    constructor(@Inject(WechatPayBaseOptions) private readonly baseOptions: WechatPayModuleOptions) {}

    async jsapi(params: WechatPayChoosePayServiceJsapiInput) {
        const nonceStr = randomChars();
        const timeStamp = Math.floor(Date.now() / 1000);
        const packageStr = `prepay_id=${params.prepay_id}`;
        const paySign = rsaSign(
            `${params.appId}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`,
            this.baseOptions.private_key
        );
        return {
            appId: params.appId,
            timeStamp,
            nonceStr,
            package: packageStr,
            signType: 'RSA',
            paySign,
        };
    }
    async app(params: WechatPayChoosePayServiceAppInput) {
        const noncestr = randomChars();
        const timestamp = Math.floor(Date.now() / 1000);
        const sign = rsaSign(
            `${params.appid}\n${timestamp}\n${noncestr}\n${params.prepayid}\n`,
            this.baseOptions.private_key
        );
        return {
            ...params,
            package: 'Sign=WXPay',
            noncestr,
            timestamp,
            sign,
        };
    }
}
