import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../src/auth.service';
import { jwtConstants } from '../src/constants';
import { UserSpareEntity } from '../src/entities/userBase.entity';
import { JwtAuthGuard } from '../src/jwt-auth.guard';
import { JwtStrategy } from '../src/jwt.strategy';
import { LocalStrategy } from '../src/local.strategy';

describe('UserService', () => {
	let service: AuthService;
	let localStrategy: LocalStrategy;
	let jwtStrategy: JwtStrategy;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: './mydb.sql',
					autoLoadEntities: true,
					// entities: [],
					synchronize: true,
				}),
				PassportModule,
				JwtModule.register({
					secret: jwtConstants.secret,
					signOptions: { expiresIn: '6h' },
				}),
				TypeOrmModule.forFeature([UserSpareEntity]),
			],
			providers: [
				AuthService,
				LocalStrategy,
				JwtStrategy,
				{
					provide: APP_GUARD,
					useClass: JwtAuthGuard,
				},
			],
			exports: [AuthService],
		}).compile();

		service = module.get<AuthService>(AuthService);
		localStrategy = module.get<LocalStrategy>(LocalStrategy);
		jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(localStrategy).toBeDefined();
		expect(jwtStrategy).toBeDefined();
	});
});
