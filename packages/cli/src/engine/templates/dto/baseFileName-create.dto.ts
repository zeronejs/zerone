import { AbstractStringTemplates } from '../../abstract.templates.engine';

export class DtoCreateStringTemplates extends AbstractStringTemplates {
    dirName = 'dto';
    public createContent() {
        const docEntry = this.docEntry;
        return `import { IsNotEmpty, IsOptional } from 'class-validator';
${docEntry.dotImports.join(`
`)}
export class ${docEntry.BaseName}CreateDto {
    ${docEntry.properties
        ?.filter(it => !it.isSpecialColumn)
        .map(it => {
            let str = `
    /**
     * ${docEntry.documentation}
     */`;
            if (it.isOptional) {
                str += `
    @IsOptional()
    ${it.name}?: ${it.type.value};`;
            } else {
                str += `
    @IsNotEmpty({
        message: '${docEntry.documentation}不能为空',
    })
    ${it.name}: ${it.type.value};
                `;
            }
            return str;
        })}
}
            
`;
    }
    public createTitle() {
        return `${this.docEntry.baseFileName}-create.dto.ts`;
    }
}
