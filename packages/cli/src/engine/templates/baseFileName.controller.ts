import { AbstractStringTemplates } from '../abstract.templates.engine';

export class ControllerStringTemplates extends AbstractStringTemplates {
    public createContent() {
        const docEntry = this.docEntry;
        return `import { Controller, Get, Post, Patch, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Limit } from '@common/utils/constants';
import { ${docEntry.BaseName}CreateDto, ${docEntry.BaseName}ListDto, ${docEntry.BaseName}AllDto, ${docEntry.BaseName}UpdateDto } from './dto';
import { ${docEntry.BaseName}Service } from './${docEntry.baseFileName}.service';
import { ${docEntry.className} } from './entities/${docEntry.baseFileName}.entity';
import { RDto, RListDto } from '@common/Result.dto';
import { BodyIdsDto } from '@common/BodyIds.dto';
import { ApiROfResponse, ApiRPrimitiveOfResponse } from '@common/ApiROfResponse';

@ApiTags('${docEntry.baseName}')
@ApiBearerAuth()
@ApiExtraModels(${docEntry.className})
@ApiHeader({
    name: 'Authorization',
    description: 'Custom token',
})
@Controller()
export class ${docEntry.BaseName}Controller {
    constructor(private readonly ${docEntry.baseName}Service: ${docEntry.BaseName}Service) {}
    /**
     * 新增${docEntry.documentation}
     */
    @ApiOperation({ summary: '新增${docEntry.documentation}' })
    @ApiROfResponse(${docEntry.className})
    @Post('/${docEntry.baseName}/create')
    async create(@Body() create${docEntry.BaseName}Dto: ${docEntry.BaseName}CreateDto) {
        const data = await this.${docEntry.baseName}Service.create(create${docEntry.BaseName}Dto);
        return new RDto({ data });
    }
    /**
     * ${docEntry.documentation}列表（query）
     */
    @ApiOperation({ summary: '${docEntry.documentation}列表（query）' })
    @ApiROfResponse(${docEntry.className}, 'array')
    @Post('/${docEntry.baseName}/list')
    async queryList(@Body() dto: ${docEntry.BaseName}ListDto) {
        const { data, total } = await this.${docEntry.baseName}Service.list(dto);
        return new RListDto({ data, total });
    }
    /**
     * ${docEntry.documentation}列表
     */
    @ApiOperation({ summary: '${docEntry.documentation}列表' })
    @ApiROfResponse(${docEntry.className}, 'array')
    @Get('/${docEntry.baseName}/list')
    async list(@Query() limit: Limit) {
        const { data, total } = await this.${docEntry.baseName}Service.list({ limit });
        return new RListDto({ data, total });
    }
    /**
     * ${docEntry.documentation}列表-全部
     */
    @ApiOperation({ summary: '${docEntry.documentation}列表-全部' })
    @ApiROfResponse(${docEntry.className}, 'array')
    @Get('/${docEntry.baseName}/all')
    async findAll(@Query() dto: ${docEntry.BaseName}AllDto) {
        const data = await this.${docEntry.baseName}Service.findAll(dto);
        return new RListDto({ data, total: data.length });
    }
    /**
     * ${docEntry.documentation}详情
     */
    @ApiOperation({ summary: '某个${docEntry.documentation}信息' })
    @ApiROfResponse(${docEntry.className})
    @Get('/${docEntry.baseName}/details/:${docEntry.primaryColumnsProperty.name}')
    async details(@Param('${docEntry.primaryColumnsProperty.name}') ${docEntry.primaryColumnsProperty.name}: ${docEntry.primaryColumnsProperty.type.value}) {
        const data = await this.${docEntry.baseName}Service.findBy${docEntry.primaryColumnsProperty.Name}(${docEntry.primaryColumnsProperty.name});
        return new RDto({ data });
    }
    /**
     * 修改${docEntry.documentation}
     */
    @ApiOperation({ summary: '修改${docEntry.documentation}信息' })
    @ApiRPrimitiveOfResponse()
    @Patch('/${docEntry.baseName}/update/:${docEntry.primaryColumnsProperty.name}')
    async update(@Param('${docEntry.primaryColumnsProperty.name}') ${docEntry.primaryColumnsProperty.name}: ${docEntry.primaryColumnsProperty.type.value}, @Body() update${docEntry.BaseName}Dto: ${docEntry.BaseName}UpdateDto) {
        await this.${docEntry.baseName}Service.update(${docEntry.primaryColumnsProperty.name}, update${docEntry.BaseName}Dto);
        return new RDto();
    }
    /**
     * 删除${docEntry.documentation}
     */
    @ApiOperation({ summary: '删除${docEntry.documentation}' })
    @ApiRPrimitiveOfResponse()
    @Delete('/${docEntry.baseName}/remove/:${docEntry.primaryColumnsProperty.name}')
    async remove(@Param('${docEntry.primaryColumnsProperty.name}') ${docEntry.primaryColumnsProperty.name}: ${docEntry.primaryColumnsProperty.type.value}) {
        await this.${docEntry.baseName}Service.delete(${docEntry.primaryColumnsProperty.name});
        return new RDto();
    }
    /**
     * 删除多个${docEntry.documentation}
     */
    @ApiOperation({ summary: '删除多个${docEntry.documentation}' })
    @ApiRPrimitiveOfResponse()
    @Post('/${docEntry.baseName}/removes')
    async removes(@Body() dto: BodyIdsDto) {
        await this.${docEntry.baseName}Service.deletes(dto.ids);
        return new RDto();
    }
}
        
`;
    }
    public createTitle() {
        return `${this.docEntry.baseFileName}.controller.ts`;
    }
}
