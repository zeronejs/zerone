import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { PhotosModule } from './api/photos/photos.module';
import { AuthModule } from './common/auth/auth.module';
import { RolesModule } from '@zeronejs/role-easy';
// import { RolesModule } from './common/role';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserService } from '@api/user/user.service';
// import * as mongoose from 'mongoose';
// import { User, UserSchema } from '@api/user/schemas/user.schema';

// mongoose.connect('mongodb://zzh:123456@172.21.1.66:27017/zoneyet_photos');
// const UserModel: any = mongoose.model(User.name, UserSchema); // 根据schema创建模型(类
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '123456',
            database: 'test',
            autoLoadEntities: true,
            // entities: [],
            synchronize: true,
        }),
        UserModule,
        MongooseModule.forRoot('mongodb://zzh:123456@172.21.1.66:27017/zoneyet_photos'),
        ConfigModule.forRoot(),
        // AuthModule.forRoot(UserModule, UserModel),
        AuthModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
            exclude: ['/api*'],
        }),
        RolesModule,
        PhotosModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
