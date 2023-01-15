import { vueLocalStorage } from './vueLocalStroge';
const TokenKey = 'vue_admin_template_token';

export function getToken() {
    return vueLocalStorage.getItem(TokenKey);
}

export function setToken(token: string) {
    return vueLocalStorage.setItem(TokenKey, token);
}

export function removeToken() {
    return vueLocalStorage.removeItem(TokenKey);
}
