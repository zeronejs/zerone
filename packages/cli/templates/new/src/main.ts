import { BodyIdsDto } from '@common/BodyIds.dto';
import { RDto, RListDto } from '@common/Result.dto';
import { getIPAdresses } from '@common/utils';
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
    const port = process.env.SERVICE_PORT ?? 5000;
    const host = process.env.SERVICE_HOSTNAME ?? '0.0.0.0';
    await app.listen(port, host, async () => {
        const url = await app.getUrl();
        const ipAdresses = getIPAdresses();
        console.log(` > Local:`);
        console.log(`           ⭐️ Application Starting on: ${url}`);
        console.log(`           ⭐️ Swagger API Starting on: ${url}/docs`);
        console.log(`           ⭐️ Admin view  Starting on: ${url}/admin`);
        if (ipAdresses.length) {
            console.log(` > Network:`);
        }
        for (const ipAdress of ipAdresses) {
            console.log(`           ⭐️ Application Starting on: http://${ipAdress}:${port}`);
            console.log(`           ⭐️ Swagger API Starting on: http://${ipAdress}:${port}/docs`);
            console.log(`           ⭐️ Admin view  Starting on: http://${ipAdress}:${port}/admin`);
        }
    });
}
bootstrap();
