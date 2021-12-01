import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WXBizDataCrypt } from '@zeronejs/utils';
import {
	WechatLoginMiniProgramServiceWxLogin,
	WechatLoginMiniProgramServiceGetSessionKey,
	WechatLoginMiniProgramServiceGetSessionKeyResult,
	WechatLoginMiniProgramServiceWxLoginResult,
	WechatLoginMiniProgramServiceGetUserProfile,
	WechatLoginMiniProgramServiceGetUserProfileResult,
} from './miniProgram.types';
/**
 * 小程序登录
 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
 */
@Injectable()
export class WechatLoginMiniProgramService {
	/**
	 * jscode2session  getUserProfile 的合集
	 */
	async wxLogin(
		input: WechatLoginMiniProgramServiceWxLogin
	): Promise<WechatLoginMiniProgramServiceWxLoginResult> {
		const sessionKeyObj = await this.jscode2session(input);
		const { openid, unionid } = sessionKeyObj;
		const data = this.getUserProfile({
			...input,
			session_key: sessionKeyObj.session_key,
		});
		return { ...data, unionid, openid };
	}
	/**
	 * encryptedData解密
	 */
	getUserProfile(
		input: WechatLoginMiniProgramServiceGetUserProfile
	): WechatLoginMiniProgramServiceGetUserProfileResult {
		const pc = new WXBizDataCrypt(input.appId, input.session_key);
		const data = pc.decryptData(input.encryptedData, input.iv);
		return data;
	}
	/**
	 * 获取session_key
	 */
	async jscode2session(input: WechatLoginMiniProgramServiceGetSessionKey) {
		const { status, data } = await axios.get<WechatLoginMiniProgramServiceGetSessionKeyResult>(
			`https://api.weixin.qq.com/sns/jscode2session?appid=${input.appId}&secret=${input.secret}&js_code=${input.code}&grant_type=authorization_code`
		);
		if (status !== 200) {
			throw { errcode: -1, errmsg: '系统繁忙' };
		}
		const { session_key, openid, unionid } = data;
		if (!session_key || !openid) {
			throw data;
		}
		return { session_key, openid, unionid };
	}
}
