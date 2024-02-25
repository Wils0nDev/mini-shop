import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, //* para cargar automaticamente las entidades
      synchronize: true  //*Esto sincroniza los cambios de la las entidades con la bd, en PRD por lo normal se usa en False
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
