import url, { fileURLToPath } from 'node:url';
import { createWriteStream, mkdirSync, writeFileSync } from 'fs';
import path from 'node:path';
import { debug } from 'console';
import { Declaration, Container } from 'postcss';
import axios from 'axios';
import { isLocalFilePath } from './utils';
import { ensureFile } from 'fs-extra';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
// postcss-font-grabber

export interface ParsedSrc {
    urlObject: url.UrlWithStringQuery;
    format?: string;
}

export interface FontSpec {
    id?: string;
    parsedSrc: ParsedSrc;
    basename: string;
    css: {
        sourceFile: string;
    };
}
const FontExtensionsToFormats: Record<string, string> = {
    eot: 'embedded-opentype',
    otf: 'opentype',
    svg: 'svg',
    ttf: 'truetype',
    woff: 'woff',
    woff2: 'woff2',
};

export function trim(text: string): string {
    return text.replace(/(^\s+|\s+$)/g, '');
}
export function guessFormatFromUrl(urlObject: url.UrlWithStringQuery): string | undefined {
    if (!urlObject.pathname) {
        return;
    }
    const extension = path.extname(urlObject.pathname);

    return FontExtensionsToFormats[extension.substring(1)];
}
export function parseSrcString(src: string): undefined | ParsedSrc {
    const result =
        /^url\s*\(\s*[\'\"]?([https?:]?[^\)]*?)[\'\"]?\s*\)(\s+format\([\'\"]?([\-a-zA-Z0-9]+)[\'\"]?\))?/.exec(
            src
        );
    if (result === null) {
        return undefined;
    }
    if (isLocalFilePath(result[1])) {
        return undefined;
    }
    const urlObject = url.parse(result[1]);
    const format = result[3] !== undefined ? result[3] : guessFormatFromUrl(urlObject);
    if (format === undefined) {
        debug(`can't get the font format from @font-face src: [${src}]`);
    }

    return {
        urlObject,
        format,
    };
}
export function getSourceCssFilePath(node: Declaration): string {
    // This traversal is for supporting dynamically created `@font-face` rules
    // that don't have the `source.input.file` property.
    // But if the root node is also dynamic, then there is nothing we can do.
    const currentNode: Declaration | Container = node;
    // while (
    //   currentNode?.source?.input?.file === undefined &&
    //   currentNode?.parent !== undefined
    // ) {
    //   currentNode = currentNode.parent!;
    // }

    const sourceFile = currentNode.source?.input?.file;
    if (sourceFile === undefined) {
        throw new Error(`Can not get CSS file path of the node: "${node.toString()}"`);
    }
    return sourceFile;
}

export function calculateFontSpecs(fontFaceNode: Declaration): FontSpec[] {
    const srcs = fontFaceNode.value.split(',').map(trim);
    const filteredAndParsedSrcs: ParsedSrc[] = srcs.reduce((parsedSrcs, src) => {
        const parsed = parseSrcString(src);
        return parsed ? [...parsedSrcs, parsed] : parsedSrcs;
    }, [] as ParsedSrc[]);
    return filteredAndParsedSrcs.map(parsedSrc => {
        return {
            // id: calculateFontId(parsedSrc.urlObject),
            parsedSrc,
            basename: path.basename(parsedSrc.urlObject.pathname ?? ''),
            css: {
                sourceFile: getSourceCssFilePath(fontFaceNode),
            },
        };
    });
}

export async function downloadFile(fileUrl: string, outputLocationPath: string) {
    await ensureFile(outputLocationPath);
    const writer = createWriteStream(outputLocationPath);
    const fileItemUrl = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
    const { data } = await axios({
        method: 'get',
        url: fileItemUrl,
        responseType: 'stream',
        proxy: false,
    });

    // 确保提供的路径的目录存在
    // mkdirSync(path.dirname(outputLocationPath), { recursive: true });
    data.pipe(writer);
    return new Promise<string>((resolve, reject) => {
        writer.on('finish', () => {
            resolve(readFileSync(outputLocationPath).toString());
        });
        writer.on('error', reject);
    });
}
export function md5(original: string): string {
    return createHash('md5').update(original).digest().toString('hex');
}
