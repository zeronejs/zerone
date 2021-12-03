import { Injectable } from '@nestjs/common';
import {
    WechatPayRefundServiceApplyParams,
    WechatPayRefundServiceApplyResult,
    WechatPayRefundServiceQueryParams,
    WechatPayRefundServiceQueryResult,
} from './refund.types';

import { WechatPayFetchService, WechatPayUnifiedorderUrl } from '../common/fetch.service';

/**
 * 退款服务
 */
@Injectable()
export class WechatPayRefundService {
    constructor(private readonly fetchService: WechatPayFetchService) {}
    /**
     * 申请退款
     * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_9.shtml
     */
    async apply(mchid: string, params: WechatPayRefundServiceApplyParams) {
        const url: WechatPayUnifiedorderUrl = {
            method: 'POST',
            pathname: '/v3/refund/domestic/refunds',
        };
        return this.fetchService.fetchWechat<WechatPayRefundServiceApplyResult>(mchid, url, params);
    }
    /**
     * 查询退款
     * https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_10.shtml
     */
    async query(params: WechatPayRefundServiceQueryParams) {
        const url: WechatPayUnifiedorderUrl = {
            method: 'GET',
            pathname: `/v3/refund/domestic/refunds/${params.out_refund_no}`,
        };
        return this.fetchService.fetchWechat<WechatPayRefundServiceQueryResult>(params.mchid, url);
    }
}
