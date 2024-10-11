import { filterTags } from '../../src/utils/generateUtil';

describe('filterTags', () => {
    test('当没有提供 includeTags 或 excludeTags 时，应返回 true', () => {
        const curTags = ['tag1', 'tag2'];
        expect(filterTags(curTags)).toBe(true);
    });

    test('当 curTags 不匹配任何 includeTags 时，应返回 false', () => {
        const curTags = ['tag1', 'tag2'];
        const includeTags = ['tag3'];
        expect(filterTags(curTags, includeTags)).toBe(false);
    });

    test('当 curTags 匹配某些 includeTags 时，应返回 true', () => {
        const curTags = ['tag1', 'tag2'];
        const includeTags = ['tag1'];
        expect(filterTags(curTags, includeTags)).toBe(true);
    });

    test('当 curTags 匹配某些 excludeTags 时，应返回 false', () => {
        const curTags = ['tag1', 'tag2'];
        const excludeTags = ['tag1'];
        expect(filterTags(curTags, undefined, excludeTags)).toBe(false);

        const excludeTags2 = ['tag2'];
        expect(filterTags(curTags, undefined, excludeTags2)).toBe(false);
    });

    test('当 curTags 不匹配任何 excludeTags 时，应返回 true', () => {
        const curTags = ['tag1', 'tag2'];
        const excludeTags = ['tag3'];
        expect(filterTags(curTags, undefined, excludeTags)).toBe(true);
    });

    test('同时处理 includeTags 和 excludeTags 时应正确工作', () => {
        const curTags = ['tag1', 'tag2'];
        const includeTags = ['tag1'];
        const excludeTags = ['tag3'];
        expect(filterTags(curTags, includeTags, excludeTags)).toBe(true);

        const includeTags2 = ['tag3'];
        const excludeTags2 = ['tag1'];
        expect(filterTags(curTags, includeTags2, excludeTags2)).toBe(false);
    });

    test('考虑 includeTags 和 excludeTags 的 startsWith 逻辑', () => {
        const curTags = ['tagXyz', 'tagAbc'];
        const includeTags = ['tagX'];
        const excludeTags = ['tagA'];
        expect(filterTags(curTags, includeTags, excludeTags)).toBe(false); // 因为 excludeTags 匹配

        const includeTags2 = ['tagX'];
        const excludeTags2 = ['tagB'];
        expect(filterTags(curTags, includeTags2, excludeTags2)).toBe(true); // 因为没有匹配到 excludeTags
    });
});
