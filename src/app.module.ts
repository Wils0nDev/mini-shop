import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessageWsModule } from './message-ws/message-ws.module';

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
    }),
    //* ServeStaticModule : Nos permite crear contenido estatico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      }),

    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessageWsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
