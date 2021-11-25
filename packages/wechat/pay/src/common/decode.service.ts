import { Inject, Injectable } from '@nestjs/common';
import { createDecipheriv } from 'crypto';
import { WechatPayBaseOptions } from './constants';
import { WechatPayModuleOptions } from '../wechatPay.module';

export interface WechatPayDecodeServiceNotifyInput {
	ciphertext: string;
	associated_data?: string;
	nonce: string;
}

@Injectable()
export class WechatPayDecodeService {
	constructor(@Inject(WechatPayBaseOptions) private readonly baseOptions: WechatPayModuleOptions) {}
	/**
	 * 解密微信支付/退款通知数据
	 */
	resource(resource: WechatPayDecodeServiceNotifyInput) {
		const AUTH_KEY_LENGTH = 16;
		// ciphertext = 密文，associated_data = 填充内容， nonce = 位移
		const { ciphertext, associated_data, nonce } = resource;
		// 密钥
		const key_bytes = Buffer.from(this.baseOptions.apiv3_private_key, 'utf8');
		// 位移
		const nonce_bytes = Buffer.from(nonce, 'utf8');
		// 填充内容
		const associated_data_bytes = Buffer.from(associated_data ?? '', 'utf8');
		// 密文Buffer
		const ciphertext_bytes = Buffer.from(ciphertext, 'base64');
		// 计算减去16位长度
		const cipherdata_length = ciphertext_bytes.length - AUTH_KEY_LENGTH;
		// upodata
		const cipherdata_bytes = ciphertext_bytes.slice(0, cipherdata_length);
		// tag
		const auth_tag_bytes = ciphertext_bytes.slice(cipherdata_length, ciphertext_bytes.length);
		const decipher = createDecipheriv('aes-256-gcm', key_bytes, nonce_bytes);
		decipher.setAuthTag(auth_tag_bytes);
		decipher.setAAD(Buffer.from(associated_data_bytes));

		return Buffer.concat([decipher.update(cipherdata_bytes), decipher.final()]).toString();
	}
}
