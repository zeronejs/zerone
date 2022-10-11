import { AbstractStringTemplates } from '../../abstract.templates.engine';

export class DtoAllStringTemplates extends AbstractStringTemplates {
    dirName = 'dto';
    public createContent() {
        const docEntry = this.docEntry;
        return `import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
${docEntry.dotImports.join(`
`)}
export class ${docEntry.BaseName}AllWhereDto {
    ${docEntry.properties
        ?.filter(it => !it.isSpecialColumn)
        .map(it => {
            return `
    /**
     * ${docEntry.documentation}
     */
    @IsOptional()
    ${it.name}?: ${it.type.value};`;
        })}
}
export class ${docEntry.BaseName}AllDto {
    @ValidateNested()
    @IsOptional()
    // 这里不加Type不会验证
    @Type(() => ${docEntry.BaseName}AllWhereDto)
    where?: ${docEntry.BaseName}AllWhereDto;
}
     
`;
    }
    public createTitle() {
        return `${this.docEntry.baseFileName}-all.dto.ts`;
    }
}
