import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database, Resource } from '@adminjs/typeorm';
import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
import { validate } from 'class-validator';
import { createAdminOption } from '@common/admin/adminOption';

Resource.validate = validate;
AdminJS.registerAdapter({ Database, Resource });
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: './mydb.sql',
            autoLoadEntities: true,
            // entities: [],
            synchronize: true,
        }),
        AdminModule.createAdminAsync(createAdminOption()),
        ConfigModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
