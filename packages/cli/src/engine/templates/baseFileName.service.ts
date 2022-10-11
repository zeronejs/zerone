import { AbstractStringTemplates } from '../abstract.templates.engine';

export class ServiceStringTemplates extends AbstractStringTemplates {
    public createContent() {
        const docEntry = this.docEntry;
        return `import { BadRequestException, Injectable } from '@nestjs/common';
import { ${docEntry.BaseName}CreateDto, ${docEntry.BaseName}ListDto, ${docEntry.BaseName}AllDto, ${docEntry.BaseName}UpdateDto } from './dto';
import { ${docEntry.className} } from './entities/${docEntry.baseFileName}.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ${docEntry.BaseName}Service {
    constructor(@InjectRepository(${docEntry.className}) private ${docEntry.baseName}Repository: Repository<${docEntry.className}>) {}

    async create(entity: ${docEntry.BaseName}CreateDto) {
        return this.${docEntry.baseName}Repository.save(entity);
    }

    findAll(dto: ${docEntry.BaseName}AllDto) {
        return this.${docEntry.baseName}Repository.find({
            where: dto.where,
            order: { createdAt: 'DESC' },
        });
    }
    async list(dto: ${docEntry.BaseName}ListDto) {
        const { page = 1, psize = 20 } = dto.limit || {};
        const [data, total] = await Promise.all([
            this.${docEntry.baseName}Repository.find({
                where: dto.where,
                order: { createdAt: 'DESC' },
                skip: (page - 1) * psize,
                take: psize,
            }),
            this.${docEntry.baseName}Repository.count({
                where: dto.where,
            }),
        ]);
        return { data, total };
    }
    async findBy${docEntry.primaryColumnsProperty.Name}(${docEntry.primaryColumnsProperty.name}: ${docEntry.primaryColumnsProperty.type.value}) {
        const entity = await this.${docEntry.baseName}Repository.findOneBy({ ${docEntry.primaryColumnsProperty.name} });

        if (!entity) throw new BadRequestException('数据不存在');
        return entity;
    }

    async update(${docEntry.primaryColumnsProperty.name}: ${docEntry.primaryColumnsProperty.type.value}, update: ${docEntry.BaseName}UpdateDto) {
        return this.${docEntry.baseName}Repository.update(${docEntry.primaryColumnsProperty.name}, update);
    }
    async delete(${docEntry.primaryColumnsProperty.name}: ${docEntry.primaryColumnsProperty.type.value}) {
        return this.${docEntry.baseName}Repository.delete({ ${docEntry.primaryColumnsProperty.name} });
    }
    async deletes(ids: number | number[]) {
        return this.${docEntry.baseName}Repository.delete(ids);
    }
}
`;
    }
    public createTitle() {
        return `${this.docEntry.baseFileName}.service.ts`;
    }
}
