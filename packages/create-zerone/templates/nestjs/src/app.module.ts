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
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@common/filters/httpException.filter';

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
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
