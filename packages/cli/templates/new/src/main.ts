import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    app.useGlobalPipes(
        new ValidationPipe({
            // 过滤dto外的字段
            whitelist: true,
        })
    );
    await app.listen(
        process.env.SERVICE_PORT ?? 5000,
        process.env.SERVICE_HOSTNAME ?? '0.0.0.0',
        async () => {
            console.log(`Application is running on: ${await app.getUrl()}`);
        }
    );
}
bootstrap();
