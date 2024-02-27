import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
 

  private readonly logger = new Logger('ProductsService');


  //*Patron repository que ya nos brinda TypeOrm
  constructor(
    @InjectRepository(Product)
    private readonly productoRepository : Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    try{
      const product = this.productoRepository.create(createProductDto)
      await this.productoRepository.save(product)
      return product
    }catch(error){
      this.handleDBExceptions(error)      
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto
    return this.productoRepository.find({
      take: limit,
      skip : offset
      //Todo Relaciones
    })
  
  }

  async findOne(term: string) {
    
    //* En estas consultas podemos hacer busqueda por id,slug o title
    let product : Product
    if(isUUID(term)){
       product = await this.productoRepository.findOneBy({id:term})
    }else{
      //*createQueryBuilder : nos permite crear consultas
      const queryBuilder =  this.productoRepository.createQueryBuilder()
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title : term.toUpperCase(),
        slug : term.toLowerCase()
      }).getOne();
    }
    if(!product) throw new NotFoundException(`Producto con ${term} no encontrado`)

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try {
      const product = await this.productoRepository.preload({
        id: id,
        ...updateProductDto
      });
      if(!product) throw new NotFoundException(`Product with id: ${id} not found`);
      await  this.productoRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }



  async remove(id: string) {
    const product = await this.productoRepository.delete({id})
    console.log(product)
    if(product.affected === 0) throw new NotFoundException(`Producto con ${id} no encontrado`)

    return product
  }

  private handleDBExceptions(error:any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs!!')

  }
}
