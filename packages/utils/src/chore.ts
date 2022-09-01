type OneOfInputItem = string | null;
/**
 * 其中的一个
 */
export const oneOf = (param: OneOfInputItem | OneOfInputItem[]) => {
    return (Array.isArray(param) ? param[0] : param) ?? '';
};
/**
 * 获取字符串中字符长度
 */
export const getByteLength = (str: string) => {
    // returns the byte length of an utf8 string
    let s = str.length;
    for (let i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--;
    }
    return s;
};
