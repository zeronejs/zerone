import { Injectable } from '@nestjs/common';
import {
    WechatPayBillService,
    WechatPayBillServiceApplyFundFlowBillInput,
    WechatPayBillServiceApplyTradeBillInput,
} from './bill';
import { WechatPayChoosePayService, WechatPayChoosePayServiceJsapiInput } from './choosePay';
import { WechatPayCloseService, WechatPayCloseServiceByOutTradeNoInput } from './close';
import { WechatPayDecodeService, WechatPayDecodeServiceNotifyInput } from './common/decode.service';
import {
    WechatPayOrderQueryService,
    WechatPayOrderQueryServiceByIdInput,
    WechatPayOrderQueryServiceByOutTradeNoInput,
} from './orderQuery';
import {
    WechatPayRefundService,
    WechatPayRefundServiceApplyParams,
    WechatPayRefundServiceQueryParams,
} from './refund';
import { UnifiedTransactionsRequestParams, WechatPayUnifiedorderService } from './unifiedorder';

/**
 * jsapi支付
 */
@Injectable()
export class WechatPayJsapiService {
    constructor(
        private readonly unifiedorderService: WechatPayUnifiedorderService,
        private readonly orderQueryService: WechatPayOrderQueryService,
        private readonly closeService: WechatPayCloseService,
        private readonly choosePayService: WechatPayChoosePayService,
        private readonly refundService: WechatPayRefundService,
        private readonly decodeService: WechatPayDecodeService,
        private readonly billService: WechatPayBillService
    ) {}
    /**
     * 下单
     */
    async unifiedorder(params: UnifiedTransactionsRequestParams) {
        return this.unifiedorderService.jsapi(params);
    }
    /**
     * 订单查询
     */
    async queryById(params: WechatPayOrderQueryServiceByIdInput) {
        return this.orderQueryService.byId(params);
    }
    /**
     * 订单查询
     */
    async queryByOutTradeNo(params: WechatPayOrderQueryServiceByOutTradeNoInput) {
        return this.orderQueryService.byOutTradeNo(params);
    }
    /**
     * 关闭订单
     */
    async close(params: WechatPayCloseServiceByOutTradeNoInput) {
        return this.closeService.byOutTradeNo(params);
    }
    /**
     * 获取调起支付的参数
     */
    async getChoosePayParams(params: WechatPayChoosePayServiceJsapiInput) {
        return this.choosePayService.jsapi(params);
    }
    /**
     * 申请退款
     */
    async refund(mchid: string, params: WechatPayRefundServiceApplyParams) {
        return this.refundService.apply(mchid, params);
    }
    /**
     * 退款查询
     */
    async refundQuery(params: WechatPayRefundServiceQueryParams) {
        return this.refundService.query(params);
    }
    /**
     * 解密微信支付/退款通知数据
     */
    async decodeResource(params: WechatPayDecodeServiceNotifyInput) {
        return this.decodeService.resource(params);
    }
    /**
     * 申请交易账单
     */
    async tradeBill(mchid: string, params: WechatPayBillServiceApplyTradeBillInput) {
        return this.billService.tradeBill(mchid, params);
    }
    /**
     * 申请资金账单
     */
    async fundFlowBill(mchid: string, params: WechatPayBillServiceApplyFundFlowBillInput) {
        return this.billService.fundFlowBill(mchid, params);
    }
    /**
     * 下载账单
     */
    async billDownload(mchid: string, download_url: string) {
        return this.billService.download(mchid, download_url);
    }
}
