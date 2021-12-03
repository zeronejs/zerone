import { DynamicModule, Module } from '@nestjs/common';
import { WechatPayUnifiedorderService } from './unifiedorder';
import { WechatPayApiHostname, WechatPayBaseOptions } from './common/constants';
import { WechatPayJsapiService } from './jsapi.pay.service';
import { WechatPayOrderQueryService } from './orderQuery';
import { WechatPayCloseService } from './close';
import { WechatPayChoosePayService } from './choosePay';
import { WechatPayRefundService } from './refund';
import { WechatPayDecodeService } from './common/decode.service';
import { WechatPayAppService } from './app.pay.service';
import { WechatPayNativeService } from './native.pay.service';
import { WechatPayBillService } from './bill';
export interface WechatPayModuleOptions {
    /**
     * 证书序列号(必填, 证书序列号，可在微信支付平台获取 也可以通过此命令获取(*_cert.pem为你的证书文件) openssl x509 -in *_cert.pem -noout -serial )
     */
    serial_no: string;
    /**
     * 商户API证书*_key.pem中内容 可在微信支付平台获取(必填, 在微信商户管理界面获取)
     */
    private_key: string;
    /**
     * apiv3密钥 在创建实例时通过apiv3密钥会自动获取平台证书的公钥，以便于验证签名(必填)
     */
    apiv3_private_key: string;
}
@Module({})
export class WechatPayModule {
    static forRoot(options: WechatPayModuleOptions): DynamicModule {
        return {
            module: WechatPayModule,
            providers: [
                {
                    provide: WechatPayApiHostname,
                    useValue: 'https://api.mch.weixin.qq.com',
                },
                {
                    provide: WechatPayBaseOptions,
                    useValue: options,
                },
                WechatPayUnifiedorderService,
                WechatPayOrderQueryService,
                WechatPayCloseService,
                WechatPayChoosePayService,
                WechatPayRefundService,
                WechatPayDecodeService,
                WechatPayBillService,
            ],
            exports: [WechatPayJsapiService, WechatPayNativeService, WechatPayAppService],
        };
    }
}
