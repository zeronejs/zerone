import { moduleSupplementary } from '../../compiler/module.supplementary';
import { AbstractStringTemplates } from '../abstract.templates.engine';

export class ModuleStringTemplates extends AbstractStringTemplates {
    canSupplementary = true;
    supplementary = moduleSupplementary;
    public createContent() {
        const docEntry = this.docEntry;
        return `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${docEntry.BaseName}Controller } from './${docEntry.baseFileName}.controller';
import { ${docEntry.BaseName}Service } from './${docEntry.baseFileName}.service';
import { ${docEntry.BaseName}Entity } from './${docEntry.entitiesName}/${docEntry.baseFileName}.entity';
@Module({
    imports: [TypeOrmModule.forFeature([${docEntry.BaseName}Entity])],
    controllers: [${docEntry.BaseName}Controller],
    providers: [${docEntry.BaseName}Service],
    exports: [${docEntry.BaseName}Service],
})
export class ${docEntry.ModuleName}Module {}
`;
    }
    public createTitle() {
        return `${this.docEntry.moduleName}.module.ts`;
    }
}
