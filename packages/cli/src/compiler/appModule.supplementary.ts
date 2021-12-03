import { DocEntry } from './ts-class.ast.document';
import { Project, Node } from 'ts-morph';
import { compact } from '@zeronejs/utils';
import { pathExistsSync } from 'fs-extra';

export function appModuleSupplementary(fileUrl: string, docEntry: DocEntry) {
    if (!pathExistsSync(fileUrl)) {
        return false;
    }
    const project = new Project();
    const sourceProject = project.addSourceFileAtPath(fileUrl);
    const appModule = sourceProject.getClass(`AppModule`);
    if (!appModule) {
        return false;
    }
    const froms = compact(sourceProject.getImportDeclarations().map(it => it.getStructure().moduleSpecifier));
    const fromUrl = `@api/${docEntry.moduleName}/${docEntry.moduleName}.module`;
    const curModuleFrom = froms.find(it => it === fromUrl);
    if (curModuleFrom) {
        return false;
    }

    const properties = appModule.getDecorator('Module')?.getArguments()?.[0];
    if (!Node.isObjectLiteralExpression(properties)) {
        return false;
    }

    const ModuleName = `${docEntry.ModuleName}Module`;

    sourceProject.addImportDeclaration({
        namedImports: [ModuleName],
        moduleSpecifier: fromUrl,
    });
    const sourceControllers = properties.getProperty('imports');
    if (Node.isPropertyAssignment(sourceControllers)) {
        const initializer = sourceControllers.getInitializer();
        if (Node.isArrayLiteralExpression(initializer)) {
            if (!initializer.getElements().find(it => it.getText() === ModuleName)) {
                initializer.addElement(ModuleName);
                sourceProject.saveSync();
                return true;
            }
        }
    }

    return false;
}
