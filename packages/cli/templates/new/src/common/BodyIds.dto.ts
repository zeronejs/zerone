import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class BodyIdsDto {
    /**
     * ids
     */
    @ApiProperty()
    @IsArray()
    @IsNumber(undefined, { each: true })
    ids: number[];
}
