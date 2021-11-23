import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { JwtConstantsSecret } from './constants';
import { ReqUser } from './index';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(@Inject(JwtConstantsSecret) private readonly secret?: string | Buffer) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: secret,
		});
	}
	/**
	 * 验证传入payload
	 * @param payload
	 * @returns
	 */
	validate(payload: ReqUser): ReqUser {
		return { id: payload.id, username: payload.username };
	}
}
