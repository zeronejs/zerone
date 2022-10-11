import { AbstractStringTemplates } from '../../abstract.templates.engine';

export class DtoListStringTemplates extends AbstractStringTemplates {
    dirName = 'dto';
    public createContent() {
        const docEntry = this.docEntry;
        return `import { Limit } from '@common/utils/constants';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
${docEntry.dotImports.join(`
`)}
export class ${docEntry.BaseName}ListWhereDto {
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
export class ${docEntry.BaseName}ListDto {
    @ValidateNested()
    @IsOptional()
    // 这里不加Type不会验证
    @Type(() => ${docEntry.BaseName}ListWhereDto)
    where?: ${docEntry.BaseName}ListWhereDto;
    @IsOptional()
    @ValidateNested()
    @Type(() => Limit)
    limit?: Limit;
}
     
`;
    }
    public createTitle() {
        return `${this.docEntry.baseFileName}-list.dto.ts`;
    }
}
