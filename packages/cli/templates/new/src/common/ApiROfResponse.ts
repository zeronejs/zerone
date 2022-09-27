import { RDto, RListDto } from '@common/Result.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SchemaObject, ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { upperFirst } from 'lodash';
export const ApiROfResponse = <TModel extends Type<any>>(
    model: TModel,
    type: 'object' | 'array' = 'object',
    Template: Type<any> = RDto
) => {
    let properties: Record<string, SchemaObject | ReferenceObject>;
    switch (type) {
        case 'object':
            properties = {
                data: {
                    type,
                    $ref: getSchemaPath(model),
                },
            };
            break;
        case 'array':
            Template = RListDto;
            properties = {
                data: {
                    type,
                    items: { $ref: getSchemaPath(model) },
                },
            };
            break;
    }
    return applyDecorators(
        ApiOkResponse({
            schema: {
                title: `${Template.name}Of${model.name}`,
                allOf: [
                    { $ref: getSchemaPath(Template) },
                    {
                        properties,
                    },
                ],
            },
        })
    );
};
type Primitive = 'boolean' | 'string' | 'number' | 'Buffer';
/**
 * 原始类型
 */
export const ApiRPrimitiveOfResponse = (
    model: Primitive = 'string',
    type: 'primitive' | 'array' = 'primitive',
    Template: Type<any> = RDto
) => {
    if (type === 'array' && Template === RDto) {
        Template = RListDto;
    }
    return applyDecorators(
        ApiOkResponse({
            schema: {
                title: `${Template.name}Of${upperFirst(model)}`,
                allOf: [
                    { $ref: getSchemaPath(Template) },
                    {
                        properties: {
                            data:
                                type === 'primitive'
                                    ? { type: model }
                                    : {
                                          type,
                                          items: { type: model },
                                      },
                        },
                    },
                ],
            },
        })
    );
};
