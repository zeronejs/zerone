import { DynamicModule, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtConstantsSecret } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSpareEntity } from './entities/userBase.entity';
@Global()
@Module({
    imports: [PassportModule, TypeOrmModule.forFeature([UserSpareEntity])],
})
export class AuthModule {
    static forRoot(options: JwtModuleOptions): DynamicModule {
        options.secret = options.secret ?? 'secretKey';
        return {
            module: AuthModule,
            imports: [JwtModule.register(options)],
            providers: [
                {
                    provide: JwtConstantsSecret,
                    useValue: options.secret,
                },
                {
                    provide: APP_GUARD,
                    useClass: JwtAuthGuard,
                },
                JwtStrategy,
                AuthService,
                LocalStrategy,
            ],
            exports: [AuthService],
        };
    }
}
