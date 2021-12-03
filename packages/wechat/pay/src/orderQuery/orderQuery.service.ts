import { Injectable } from '@nestjs/common';

import { WechatPayFetchService, WechatPayUnifiedorderUrl } from '../common/fetch.service';
import {
    WechatPayOrderQueryResult,
    WechatPayOrderQueryServiceByIdInput,
    WechatPayOrderQueryServiceByOutTradeNoInput,
} from './orderQuery.types';
/**
 * 查询订单服务
 */
@Injectable()
export class WechatPayOrderQueryService {
    constructor(private readonly fetchService: WechatPayFetchService) {}

    async byId(params: WechatPayOrderQueryServiceByIdInput) {
        const url: WechatPayUnifiedorderUrl = {
            method: 'GET',
            pathname: `/v3/pay/transactions/id/${params.transaction_id}?mchid=${params.mchid}`,
        };
        return this.fetchService.fetchWechat<WechatPayOrderQueryResult>(params.mchid, url);
    }
    async byOutTradeNo(params: WechatPayOrderQueryServiceByOutTradeNoInput) {
        const url: WechatPayUnifiedorderUrl = {
            method: 'GET',
            pathname: `/v3/pay/transactions/out-trade-no/${params.out_trade_no}?mchid=${params.mchid}`,
        };
        return this.fetchService.fetchWechat<WechatPayOrderQueryResult>(params.mchid, url);
    }
}
