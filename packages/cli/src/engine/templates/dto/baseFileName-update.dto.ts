import { AbstractStringTemplates } from '../../abstract.templates.engine';

export class DtoUpdateStringTemplates extends AbstractStringTemplates {
    dirName = 'dto';
    public createContent() {
        const docEntry = this.docEntry;
        return `import { IsOptional } from 'class-validator';
${docEntry.dotImports.join(`
`)}
export class ${docEntry.BaseName}UpdateDto {${docEntry.properties
        ?.filter(it => !it.isSpecialColumn)
        .map(it => {
            return `
    /**
     * ${it.documentation}
     */
    @IsOptional()
    ${it.name}?: ${it.type.value};`;
        }).join('')}
}
            
`;
    }
    public createTitle() {
        return `${this.docEntry.baseFileName}-update.dto.ts`;
    }
}
