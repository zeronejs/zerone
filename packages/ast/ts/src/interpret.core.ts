import * as ts from 'typescript';

export class InterpretCore {
    constructor(
        fileName: string,
        options: ts.CompilerOptions = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
        }
    ) {
        // Build a program using the set of root file names in fileNames
        const program = ts.createProgram([fileName], options);
        this.program = program;
        // Get the checker, we will use it to find more about classes
        const sources = program.getSourceFiles();
        // 过滤ts自带声明(.d.ts)文件 和 无关文件
        const sourceFile = sources.find(it => !it.isDeclarationFile && fileName === it.fileName);
        if (!sourceFile) {
            throw new Error('Ts did not find the source file');
        }
        this.sourceFile = sourceFile;
    }
    program: ts.Program;
    sourceFile: ts.SourceFile;

    getDeclarationsItem(declarationType: DeclarationType.importDeclaration): ts.ImportDeclaration[];
    getDeclarationsItem(declarationType: DeclarationType.exportDeclaration): ts.ExportDeclaration[];
    getDeclarationsItem(declarationType: DeclarationType.interfaceDeclarations): ts.InterfaceDeclaration[];
    getDeclarationsItem(declarationType: DeclarationType.typeAliasDeclarations): ts.TypeAliasDeclaration[];
    getDeclarationsItem(declarationType: DeclarationType.enumDeclarations): ts.EnumDeclaration[];
    getDeclarationsItem(declarationType: DeclarationType.variableStatements): ts.VariableStatement[];
    getDeclarationsItem(declarationType: DeclarationType.classDeclarations): ts.ClassDeclaration[];
    /**
     * 获取源文件的声明列表
     * @param type
     */
    getDeclarationsItem(declarationType: DeclarationType) {
        return this.sourceFile.statements
            .map(statement => {
                switch (declarationType) {
                    // 导入
                    case DeclarationType.importDeclaration:
                        if (ts.isImportDeclaration(statement)) {
                            return statement;
                        }
                        break;
                    // 导入
                    case DeclarationType.exportDeclaration:
                        if (ts.isExportDeclaration(statement)) {
                            return statement;
                        }
                        break;
                    // 变量
                    case DeclarationType.variableStatements:
                        if (ts.isVariableStatement(statement)) {
                            return statement;
                        }
                        break;
                    // 枚举
                    case DeclarationType.enumDeclarations:
                        if (ts.isEnumDeclaration(statement)) {
                            return statement;
                        }
                        break;
                    // interface
                    case DeclarationType.interfaceDeclarations:
                        if (ts.isInterfaceDeclaration(statement)) {
                            return statement;
                        }
                        break;
                    // interface
                    case DeclarationType.typeAliasDeclarations:
                        if (ts.isTypeAliasDeclaration(statement)) {
                            return statement;
                        }
                        break;
                    // 类
                    case DeclarationType.classDeclarations:
                        if (ts.isClassDeclaration(statement)) {
                            return statement;
                        }
                        break;
                }
                return [];
            })
            .flat();
    }
    getIdentifierTextName(name: ts.PropertyName | ts.BindingName) {
        if (ts.isIdentifier(name)) {
            return ts.unescapeLeadingUnderscores(name.escapedText);
        } else {
            return name.getText(this.sourceFile);
        }
    }
}
export enum DeclarationType {
    importDeclaration,
    exportDeclaration,
    variableStatements,
    enumDeclarations,
    classDeclarations,
    interfaceDeclarations,
    typeAliasDeclarations,
}
