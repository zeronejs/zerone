import { Injectable } from '@nestjs/common';
import { WechatPayFetchService, WechatPayUnifiedorderUrl } from '../common/fetch.service';
import {
    WechatPayBillServiceApplyTradeBillInput,
    WechatPayBillServiceApplyBillResult,
    WechatPayBillServiceApplyFundFlowBillInput,
} from './bill.types';

/**
 * 调起支付参数服务
 */
@Injectable()
export class WechatPayBillService {
    constructor(private readonly fetchService: WechatPayFetchService) {}
    /**
     * 申请交易账单
     */
    async tradeBill(mchid: string, params: WechatPayBillServiceApplyTradeBillInput) {
        const url: WechatPayUnifiedorderUrl = {
            method: 'GET',
            pathname: `/v3/bill/tradebill?bill_date=${params.bill_date}${
                params.bill_type ? '&bill_type=' + params.bill_type : ''
            }${params.tar_type ? '&tar_type=' + params.tar_type : ''}`,
        };
        return this.fetchService.fetchWechat<WechatPayBillServiceApplyBillResult>(mchid, url);
    }
    /**
     * 申请资金账单
     */
    async fundFlowBill(mchid: string, params: WechatPayBillServiceApplyFundFlowBillInput) {
        const url: WechatPayUnifiedorderUrl = {
            method: 'GET',
            pathname: `/v3/bill/fundflowbill?bill_date=${params.bill_date}${
                params.account_type ? '&account_type=' + params.account_type : ''
            }${params.tar_type ? '&tar_type=' + params.tar_type : ''}`,
        };
        return this.fetchService.fetchWechat<WechatPayBillServiceApplyBillResult>(mchid, url);
    }
    /**
     * 下载账单
     */
    async download(mchid: string, download_url: string) {
        const url: WechatPayUnifiedorderUrl = {
            method: 'GET',
            pathname: download_url.substring(download_url.indexOf('/v3')),
        };
        return this.fetchService.fetchWechat(mchid, url);
    }
}
