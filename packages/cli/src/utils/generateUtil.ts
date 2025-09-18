import pinyin from 'pinyin';
import { camelCase, upperFirst } from 'lodash';
// import { pathToRegexp } from 'path-to-regexp';
export function hasChinese(str: string) {
    const reg = /[\u4e00-\u9fa5]/g; // 中文字符的 Unicode 范围
    return reg.test(str);
}

// swagger中tags的中文换成拼音
export const tagsChineseToPinyin = (str: string) => {
    str = str.replaceAll(' ', '');
    if (!hasChinese(str)) {
        return str;
    }
    return str
        .split('/')
        .map(it => {
            if (!hasChinese(it)) {
                return it;
            }
            return chineseToPinyin(it);
        })
        .join('/');
};
// 我们针对的是ts interface，所以首字母大写
export const chineseToPinyin = (str: string) => {
    const arr: string[][] = pinyin(str, { style: pinyin.STYLE_NORMAL });
    return arr.map(a => upperFirst(a.join(''))).join('');
};

export const escapeVar = (varName: string) => {
    let name = varName.replace(/\s|[^0-9a-zA-Z]/g, '_');
    if (/[0-9]/.test(name[0])) {
        name = 'n' + name;
    }
    // 全驼峰
    return upperFirst(camelCase(name));
};

export const createModelFileName = (ref: string) => {
    const fileName = ref.replace(/^#\//g, '');
    const paths = fileName.split('/');
    paths.pop();
    paths.push(getRefTypeName(ref));
    return paths.join('/') + '.ts';
};

export const getRefTypeName = (ref: string) => {
    const paths = ref.split('/');
    let modelName = paths.pop() as string;
    // 过滤 »  过滤 «
    modelName = modelName.replaceAll('%C2%BB', '').replaceAll('%C2%AB', '');
    if (/[^0-9a-zA-Z]/.test(modelName)) {
        return escapeVar(chineseToPinyin(modelName));
    }
    return escapeVar(modelName);
};

/**
 *
 * @param pathKey swagger文档中，有些key包含query，
 * 如 /branchcompanies/{branchCompanyId}/availability{?enabled}
 * query在parameters字段中有体现，需要把{?enabled}移除掉
 */
export function trimQuery(url: string) {
    return url.replace(/\{\?.*\}/g, '');
}

export function matchAll(reg: RegExp, str: string) {
    const matches: RegExpExecArray[] = [];
    let result = reg.exec(str);
    while (result) {
        matches.push(result);
        result = reg.exec(str);
    }
    return matches;
}
/**
 * 将swagger路径模板解析成字符串
 * 获取匹配到的matches
 * @param pathTemplate swagger里面路径模板，类似于 /abc/{param}
 */
export function parseSwaggerPathMatches(pathTemplate: string) {
    pathTemplate = trimQuery(pathTemplate);
    const reg = /{(.+?)}/g;
    const matches = matchAll(reg, pathTemplate);
    return matches;
}
/**
 * 将swagger路径模板解析成字符串
 * 用于请求路径
 * @param pathTemplate swagger里面路径模板，类似于 /abc/{param}
 */
export function parseSwaggerPathTemplate(pathTemplate: string) {
    const matches = parseSwaggerPathMatches(pathTemplate);
    if (!matches.length) {
        return pathTemplate;
    }
    let resPath = pathTemplate;
    matches.map(matchItem => {
        resPath = resPath.replace(matchItem[0], `\${params.${matchItem[1]}}`);
    });
    return resPath;
}
/**
 * 将swagger路径模板解析成字符串
 * 用于生成方法名
 * @param pathTemplate swagger里面路径模板，类似于 /abc/{param}
 */
export function parseSwaggerPathTemplateToFnName(pathTemplate: string) {
    const matches = parseSwaggerPathMatches(pathTemplate);
    if (!matches.length) {
        return pathTemplate;
    }
    let resPath = pathTemplate;
    matches.map(matchItem => {
        resPath = resPath.replace(matchItem[0], `By${matchItem[0]}`);
    });
    return resPath;
}
/**
 * 字符串是否是数字开头
 * @param str
 * @returns
 */
export function isNumberStart(str: string) {
    return /^\d/.test(str);
}

/**
 * tags过滤
 */
export const filterTags = (curTags: string[], includeTags?: string[], excludeTags?: string[]) => {
    if (
        includeTags &&
        includeTags.length &&
        // 当前curTags不存在于includeTags中 则过滤掉
        !includeTags.filter(Boolean).some(item => curTags.some(tagsItem => tagsItem.startsWith(item)))
    ) {
        return false;
    }
    // excludeTags
    if (
        excludeTags &&
        excludeTags.length &&
        // 当前curTags存在于 excludeTags 中 则过滤掉
        excludeTags.filter(Boolean).some(item => curTags.some(tagsItem => tagsItem.startsWith(item)))
    ) {
        return false;
    }
    return true;
};

/**
 * 检查路径是否匹配
 * @param path
 * @param includePaths
 * @param excludePaths
 * @returns
 */
export function checkPath(path: string, includePaths?: string[], excludePaths?: string[]) {
    // Helper function to test if a path matches any pattern in the list
    const matchesPattern = (path: string, patterns?: string[]) => {
        return patterns?.some(pattern => {
            // 解决链接中携带问号
            return pattern === path;
            // const { regexp } = pathToRegexp(pattern);
            // return regexp.test(path);
        });
    };

    // Check if path matches any include pattern and does not match any exclude pattern
    const isIncluded = matchesPattern(path, includePaths);
    const isExcluded = matchesPattern(path, excludePaths);
    return {
        isIncluded,
        isExcluded,
    };
}
