import { SetMetadata } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

export const IS_SKIP_JWT_AUTH_KEY = 'isPublic';
export const SkipJwtAuth = () => SetMetadata(IS_SKIP_JWT_AUTH_KEY, true);

export const jwtConstants = {
    secret: 'secretKey',
};

export interface ReqUser {
    id: number;
    username: string;
}
export interface Request extends ExpressRequest {
    user: ReqUser;
}
