import { DocEntry } from './ts-class.ast.document';
import { Project } from 'ts-morph';
import { compact } from '@zeronejs/utils';

export function indexSupplementary(fileUrl: string, docEntry: DocEntry) {
    const project = new Project();
    const sourceProject = project.addSourceFileAtPath(fileUrl);
    const froms = compact(sourceProject.getExportDeclarations().map(it => it.getStructure().moduleSpecifier));

    const dtoFormNames = [
        `./${docEntry.baseFileName}-create.dto`,
        `./${docEntry.baseFileName}-list.dto`,
        `./${docEntry.baseFileName}-update.dto`,
        `./${docEntry.baseFileName}-all.dto`,
    ].filter(it => !froms.includes(it));
    if (dtoFormNames.length === 0) {
        return false;
    }
    sourceProject.addExportDeclarations(
        dtoFormNames.map(it => {
            return { moduleSpecifier: it };
        })
    );
    sourceProject.saveSync();
    return true;
}
