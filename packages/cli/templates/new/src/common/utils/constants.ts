import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { join } from 'path';
export const PublicUrl = join(__dirname, '..', '..', '../public');
export class Limit {
    @ApiProperty()
    @IsNumber()
    page: number;
    @ApiProperty()
    @IsNumber()
    psize: number;
}
