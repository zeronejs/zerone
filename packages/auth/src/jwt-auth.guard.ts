import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_SKIP_JWT_AUTH_KEY } from './index';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isSkip = this.reflector.getAllAndOverride<boolean>(IS_SKIP_JWT_AUTH_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isSkip) {
            return true;
        }
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }
    /**
     *
     * @param err
     * @param user
     * @param info
     */
    handleRequest(err: any, user: any) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException('请重新登录');
        }
        return user;
    }
}
