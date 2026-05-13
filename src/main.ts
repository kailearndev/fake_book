import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow only your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }); // Cho phép CORS cho tất cả các nguồn
  const config = new DocumentBuilder().addBearerAuth()
    .setTitle('Fake Book API')
    .setDescription('The fake book API description')
    .setVersion('1.0')
    .addTag('fake-book')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
