import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
    WechatLoginOauth2ServiceGetCodeInput,
    WechatLoginOauth2ServiceGetAccessTokenInput,
    WechatLoginOauth2ServiceRefreshAccessTokenInput,
    WechatLoginOauth2ServiceGetUserInfoInput,
    WechatLoginOauth2ServiceCheckAccessTokenInput,
    WechatLoginOauth2ServiceGetAccessTokenResult,
    WechatLoginOauth2ServiceCheckAccessTokenResult,
    WechatLoginOauth2ServiceGetUserInfoResult,
} from './oauth2.types';

/**
 * 网页授权
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
@Injectable()
export class WechatLoginOauth2Service {
    getCode(input: WechatLoginOauth2ServiceGetCodeInput) {
        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${input.appid}&redirect_uri=${
            input.redirect_uri
        }&response_type=code&scope=${input.scope}${
            input.state ? '&state=' + input.state : ''
        }#wechat_redirect`;
    }
    getAccessToken(input: WechatLoginOauth2ServiceGetAccessTokenInput) {
        return axios.get<WechatLoginOauth2ServiceGetAccessTokenResult>(
            `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${input.appid}&secret=${input.secret}&code=${input.code}&grant_type=authorization_code`
        );
    }
    refreshAccessToken(input: WechatLoginOauth2ServiceRefreshAccessTokenInput) {
        return axios.get<WechatLoginOauth2ServiceGetAccessTokenResult>(
            `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${input.appid}&grant_type=refresh_token&refresh_token=${input.refresh_token}`
        );
    }
    getUserInfo(input: WechatLoginOauth2ServiceGetUserInfoInput) {
        return axios.get<WechatLoginOauth2ServiceGetUserInfoResult>(
            `https://api.weixin.qq.com/sns/userinfo?access_token=${input.access_token}&openid=${input.openid}&lang=${input.lang}`
        );
    }

    checkAccessToken(input: WechatLoginOauth2ServiceCheckAccessTokenInput) {
        return axios.get<WechatLoginOauth2ServiceCheckAccessTokenResult>(
            `https://api.weixin.qq.com/sns/auth?access_token=${input.access_token}&openid=${input.openid}`
        );
    }
}
