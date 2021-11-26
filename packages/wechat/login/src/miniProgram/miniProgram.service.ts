import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WXBizDataCrypt } from '@zeronejs/utils';
import {
	WechatLoginMiniProgramServiceGetUserInfo,
	WechatLoginMiniProgramServiceGetSessionKey,
} from './miniProgram.types';
/**
 * 小程序登录
 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
 */
@Injectable()
export class WechatLoginMiniProgramService {
	async getUserInfo(input: WechatLoginMiniProgramServiceGetUserInfo) {
		const sessionKey = await this.getSessionKey(input);
		const pc = new WXBizDataCrypt(input.appId, sessionKey);
		const data = pc.decryptData(input.encryptedData, input.iv);
		return data;
	}
	async getSessionKey(input: WechatLoginMiniProgramServiceGetSessionKey) {
		const { status, data } = await axios({
			method: 'get',
			url: `https://api.weixin.qq.com/sns/jscode2session?appid=${input.appId}&secret=${input.secret}&js_code=${input.code}&grant_type=authorization_code`,
		});
		if (status !== 200) {
			throw new Error('网络错误，请重试');
		}
		return data.session_key;
	}
}
