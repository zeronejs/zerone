import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyUserPassword } from '@zeronejs/utils';
import { ReqUser } from './index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSpareEntity } from './entities/userBase.entity';
@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectRepository(UserSpareEntity)
		private usersRepository: Repository<UserSpareEntity>
	) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.usersRepository.findOne({ username });
		if (!user) {
			return null;
		}
		console.log(user);
		const verify = await verifyUserPassword(pass, user.password);
		if (user && verify) {
			Reflect.deleteProperty(user, 'password');
			// const { password, ...result } = user;
			return user;
		}
		return null;
	}
	/**
	 * 登录并生成token
	 * @param user 完整用户
	 * @returns
	 */
	async login(user: UserSpareEntity) {
		const payload: ReqUser = { username: user.username, id: user.id };
		return {
			accessToken: this.jwtService.sign(payload),
		};
	}
}
