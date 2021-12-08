import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { RolesModule } from '@zeronejs/role-easy';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from '@zeronejs/auth';
@Module({
    imports: [
        // TypeOrmModule.forRoot({
        //     type: 'postgres',
        //     host: 'localhost',
        //     port: 5432,
        //     username: 'postgres',
        //     password: '123456',
        //     database: 'test',
        //     autoLoadEntities: true,
        //     // entities: [],
        //     synchronize: true,
        // }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: './mydb.sql',
            autoLoadEntities: true,
            // entities: [],
            synchronize: true,
        }),
        ConfigModule.forRoot(),
        // RolesModule,
        // AuthModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
            exclude: ['/docs*'],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
