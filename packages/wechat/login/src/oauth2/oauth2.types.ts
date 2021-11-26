export interface WechatLoginOauth2ServiceGetCodeInput {
    appid: string;
    redirect_uri: string;
    scope: 'snsapi_base' | 'snsapi_userinfo';
    state?: string;
}
export interface WechatLoginOauth2ServiceGetAccessTokenInput {
    appid: string;
    secret: string;
    code: string;
}
export interface WechatLoginOauth2ServiceGetAccessTokenResult {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    openid: string;
    scope: string;
}
export interface WechatLoginOauth2ServiceRefreshAccessTokenInput {
    appid: string;
    refresh_token: string;
}
export interface WechatLoginOauth2ServiceCheckAccessTokenInput {
    access_token: string;
    openid: string;
}
export interface WechatLoginOauth2ServiceCheckAccessTokenResult {
    errcode: string;
    errmsg: string;
}
export interface WechatLoginOauth2ServiceGetUserInfoInput {
    access_token: string;
    openid: string;
    lang: 'zh_CN' | 'zh_TW' | 'en';
}
export interface WechatLoginOauth2ServiceGetUserInfoResult {
    openid: string;
    nickname: string;
    sex: 0 | 1 | 2;
    province: string;
    city: string;
    country: string;
    headimgurl: string;
    privilege: string[];
    unionid?: string;
}
