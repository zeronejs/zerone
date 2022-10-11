import { DocEntry } from '../compiler/ts-class.ast.document';
export abstract class AbstractStringTemplates {
    docEntry: DocEntry;
    dirName = '';
    canSupplementary = false;
    supplementary = (...args: any[]) => false;
    constructor(docEntry: DocEntry) {
        this.docEntry = docEntry;
    }

    public abstract createContent(): string;
    public abstract createTitle(): string;
}
