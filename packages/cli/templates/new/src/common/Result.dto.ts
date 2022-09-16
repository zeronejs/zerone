import { ApiProperty } from '@nestjs/swagger';

export class RDto<T> {
    constructor({
        code = 200,
        msg = '',
        status = 0,
        data,
    }: {
        code?: number;
        status?: number;
        msg?: string;
        data?: T | undefined;
    } = {}) {
        this.code = code;
        this.status = status;
        this.msg = msg;
        this.data = data;
    }

    /**
     * 通用状态码[200:正常, 400: 客户端参数错误, 500: 服务器内部错误]
     */
    @ApiProperty()
    code: number;
    /**
     * 业务状态码(0为标准状态,其它见方法提示)
     */
    @ApiProperty()
    status: number;
    /**
     * 业务详细信息(可为空)
     */
    @ApiProperty()
    msg: string;

    @ApiProperty()
    data: T;
}
export class RListDto<T> extends RDto<T> {
    constructor({
        total = 0,
        code = 200,
        msg = '',
        status = 0,
        data,
    }: {
        total?: number;
        code?: number;
        status?: number;
        msg?: string;
        data: T;
    }) {
        super({ code, msg, status, data });
        this.total = total;
    }
    @ApiProperty()
    total: number;
}
