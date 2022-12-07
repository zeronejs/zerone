import { AbstractStringTemplates } from '../../abstract.templates.engine';

export class DtoCreateStringTemplates extends AbstractStringTemplates {
    dirName = 'dto';
    public createContent() {
        const docEntry = this.docEntry;
        return `import { IsNotEmpty, IsOptional } from 'class-validator';
${docEntry.dotImports.join(`
`)}
export class ${docEntry.BaseName}CreateDto {${docEntry.properties
        ?.filter(it => !it.isSpecialColumn)
        .map(it => {
            let str = `
    /**
     * ${it.documentation}
     */`;
            if (it.isOptional) {
                str += `
    @IsOptional()
    ${it.name}?: ${it.type.value};`;
            } else {
                str += `
    @IsNotEmpty({
        message: '${it.documentation}不能为空',
    })
    ${it.name}: ${it.type.value};
                `;
            }
            return str;
        }).join('')}
}
            
`;
    }
    public createTitle() {
        return `${this.docEntry.baseFileName}-create.dto.ts`;
    }
}
