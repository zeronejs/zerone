import { BodyIdsDto } from '@common/BodyIds.dto';
import { RDto, RListDto } from '@common/Result.dto';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' });
    const config = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('<a href="/docs-json">/docs-json</a>')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [RDto, RListDto, BodyIdsDto],
    });
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
            const url = await app.getUrl();
            console.log(`⭐️ Application Starting on: ${url}`);
            console.log(`⭐️ Swagger API Starting on: ${url}/docs`);
            console.log(`⭐️ Admin view  Starting on: ${url}/admin`);
        }
    );
}
bootstrap();
