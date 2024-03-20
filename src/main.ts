import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );
   //* DocumentBuilder : Estructura un documento base que se ajuste a la especificación OpenAPI
   const config = new DocumentBuilder()
    .setTitle('Mini Shop RESTFull API')
    .setDescription('Mini Shop endpoints')
    .setVersion('1.0')
    .build();
    //*Creamos el documento pasandole la apliación y su configuración
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
  console.log(`Aplicación corrien en el puerto ${process.env.PORT}`)
}
bootstrap();
