import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product,ProductImage } from './entities/';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  //* Aqui es donde importamos nuestras entidades para que typeorm las mapee y cree en bd
  imports: [ 
    AuthModule,
    TypeOrmModule.forFeature([Product,ProductImage]) 
  ],
  exports:[
    ProductsService,
  ]
})
export class ProductsModule {}
