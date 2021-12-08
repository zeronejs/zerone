import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
