export interface WechatLoginMiniProgramServiceWxLogin {
    appId: string;
    code: string;
    encryptedData: string;
    iv: string;
    secret: string;
}
export interface WechatLoginMiniProgramServiceGetUserProfile {
    appId: string;
    encryptedData: string;
    iv: string;
    session_key: string;
}

export interface WechatLoginMiniProgramServiceGetSessionKey {
    appId: string;
    code: string;
    secret: string;
}

export interface WechatLoginMiniProgramServiceGetSessionKeyResult {
    openid?: string;
    session_key?: string;
    expires_in?: number;
    unionid?: string;
    errcode?: number;
    errmsg?: string;
}
export interface WechatLoginMiniProgramServiceGetUserProfileResult {
    avatarUrl: string;
    /**
     * 市
     */
    city: string;
    /**
     * 国家
     */
    country: string;
    gender: number;
    language: string;
    nickName: string;
    /**
     * 省
     */
    province: string;
    watermark: {
        timestamp: number;
        appid: string;
    };
}
export interface WechatLoginMiniProgramServiceWxLoginResult
    extends WechatLoginMiniProgramServiceGetUserProfileResult {
    openid: string;
    unionid?: string;
}
