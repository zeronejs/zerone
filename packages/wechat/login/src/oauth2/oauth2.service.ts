import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { URL } from 'url';
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
        const myURL = new URL('https://open.weixin.qq.com/connect/oauth2/authorize');
        myURL.searchParams.set('app_id', input.appid);
        myURL.searchParams.set('redirect_uri', input.redirect_uri);
        myURL.searchParams.set('response_type', 'code');
        myURL.searchParams.set('scope', input.scope);
        if (input.state) {
            myURL.searchParams.set('state', input.state);
        }
        myURL.hash = '#wechat_redirect';
        return myURL.href;
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
