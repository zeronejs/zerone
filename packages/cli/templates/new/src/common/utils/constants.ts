import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { join } from 'path';
export const PublicUrl = join(__dirname, '..', '..', '../public');
export class Limit {
    @ApiProperty({
        description: '页码',
        default: 0,
    })
    @IsNumber()
    page: number;
    @ApiProperty({
        description: 'psize',
        default: 20,
    })
    @IsNumber()
    psize: number;
}
