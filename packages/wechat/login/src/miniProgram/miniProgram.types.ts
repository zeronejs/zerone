export interface WechatLoginMiniProgramServiceGetUserInfo {
	appId: string;
	code: string;
	encryptedData: string;
	iv: string;
	secret: string;
}

export interface WechatLoginMiniProgramServiceGetSessionKey {
	appId: string;
	code: string;
	secret: string;
}
