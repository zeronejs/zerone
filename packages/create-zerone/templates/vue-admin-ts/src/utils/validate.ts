/**
 * Created by PanJiaChen on 16/11/18.
 */


export function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path);
}


export function validUsername(str: string): boolean {
    const validMap = ['admin', 'editor'];
    return validMap.indexOf(str.trim()) >= 0;
}
