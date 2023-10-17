import { hex_md5 } from '../src/md5';
describe('@zeronejs/utils => md5', () => {
    it('md5 abc', async () => {
        expect(hex_md5('abc')).toEqual(`900150983cd24fb0d6963f7d28e17f72`);
    });
});
