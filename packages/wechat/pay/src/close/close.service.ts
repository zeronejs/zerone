import { Injectable } from '@nestjs/common';

import { WechatPayFetchService, WechatPayUnifiedorderUrl } from '../common/fetch.service';
import { WechatPayCloseServiceByOutTradeNoInput } from './close.types';

/**
 * 关闭订单服务
 */
@Injectable()
export class WechatPayCloseService {
    constructor(private readonly fetchService: WechatPayFetchService) {}

    async byOutTradeNo(params: WechatPayCloseServiceByOutTradeNoInput) {
        const url: WechatPayUnifiedorderUrl = {
            method: 'GET',
            pathname: `/v3/pay/transactions/out-trade-no/${params.out_trade_no}/close`,
        };
        return this.fetchService.fetchWechat(params.mchid, url);
    }
}
