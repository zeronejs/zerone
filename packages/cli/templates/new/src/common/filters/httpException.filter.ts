import { RDto } from '@common/Result.dto';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { isString } from '@zeronejs/utils';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        // const request = ctx.getRequest<Request>();
        let status: number;
        let excRes: string | object;
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            excRes = exception.getResponse();
        } else if (exception instanceof QueryFailedError) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            excRes = exception.message;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            excRes = exception as object;
        }

        let resDto: RDto<null>;
        if (isString(excRes)) {
            resDto = new RDto({ code: status, data: null, msg: excRes });
        } else {
            resDto = new RDto({ code: status, data: null, ...excRes });
        }
        response.status(200).json(resDto);
    }
}
