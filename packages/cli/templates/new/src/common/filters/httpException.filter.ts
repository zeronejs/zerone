import { RDto } from '@common/Result.dto';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { isString } from '@zeronejs/utils';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        // const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const excRes = exception.getResponse();
        let resDto: RDto<null>;
        if (isString(excRes)) {
            resDto = new RDto({ code: status, data: null, msg: excRes });
        } else {
            resDto = new RDto({ code: status, data: null, ...excRes });
        }
        response.status(200).json(resDto);
    }
}
