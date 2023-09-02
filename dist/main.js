"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./exception/http-exception.filter");
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(new common_1.Logger()));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('diedie API')
        .setDescription('diedie 개발을 위한 API 문서입니다.')
        .addTag('diediebackend')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const PORT = process.env.PORT || 3095;
    await app.listen(PORT);
    console.log(`server listening on port ${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map