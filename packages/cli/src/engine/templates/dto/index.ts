import { AbstractStringTemplates } from '../../abstract.templates.engine';
import { indexSupplementary } from '../../../compiler/index.supplementary';

export class DtoIndexStringTemplates extends AbstractStringTemplates {
    dirName = 'dto';
    canSupplementary = true;
    supplementary = indexSupplementary;
    public createContent() {
        const docEntry = this.docEntry;
        return `export * from './${docEntry.baseFileName}-create.dto';
export * from './${docEntry.baseFileName}-list.dto';
export * from './${docEntry.baseFileName}-update.dto';
export * from './${docEntry.baseFileName}-all.dto';       
`;
    }
    public createTitle() {
        return `index.ts`;
    }
}
