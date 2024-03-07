import path from 'node:path';

export function isURL(str: string) {
    try {
        const parsedUrl = new URL(str);
        return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch (e) {
        // 解析出错，则不是合法的URL
        return false;
    }
}

export function isLocalFilePath(str: string) {
    // 如果以 "//" 开头但不是 "http://" 或 "https://"，则可能是网络URL
    if (str.startsWith('//')) {
        return false;
    }
    // 如果是合法的URL，则肯定不是本地文件路径
    if (isURL(str)) {
        return false;
    }

    // 检查是否为绝对路径或相对路径
    if (path.isAbsolute(str) || str.startsWith('./') || str.startsWith('../')) {
        return true;
    }

    // 如果没有任何协议和路径标识（比如 './' 或 '../'），也认为是本地文件路径
    if (!str.includes('://')) {
        return true;
    }

    return false;
}
