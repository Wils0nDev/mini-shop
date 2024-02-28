import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {
 

  private readonly logger = new Logger('ProductsService');


  //*Patron repository que ya nos brinda TypeOrm
  constructor(
    @InjectRepository(Product)
    private readonly productoRepository : Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productoImgRepository : Repository<ProductImage>,

    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto) {
    try{
      //* "..." operador rest, nos permite encerrar los valores en un solo parametro
      const {images = [], ...productDetails} = createProductDto;

      //* "..." operador spred :  ayuda a expandir los iterables en elementos individuales.
      const product = this.productoRepository.create({
        ...productDetails,
        images: images.map(image => this.productoImgRepository.create({url:image})) //*creo instancias de imagenes dentro de este producto
        
      });
      
      await this.productoRepository.save(product)
      return {...product, images}
    }catch(error){
      this.handleDBExceptions(error)      
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto
    const products = await this.productoRepository.find({
      take: limit,
      skip : offset,
      relations: {
        images: true
      }
    })
    
    //* Esto me sirve para aplanar mis imagenes y retorne en forma images[ "img1", "img2"]
    return products.map(product => ({
      ...product,
      images: product.images.map(img=> img.url)
    }))
  
  }

  async findOne(term: string) {
    
    //* En estas consultas podemos hacer busqueda por id,slug o title
    let product : Product
    if(isUUID(term)){
       product = await this.productoRepository.findOneBy({id:term})
    }else{
      //*createQueryBuilder : nos permite crear consultas
      const queryBuilder =  this.productoRepository.createQueryBuilder('prod')
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title : term.toUpperCase(),
        slug : term.toLowerCase()
      })
      .leftJoinAndSelect('prod.images','ProductImages')
      .getOne();
    }
    if(!product) throw new NotFoundException(`Producto con ${term} no encontrado`)

    return product
  }

  async findOnePlain(term: string){
    const { images = [] , ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(img=>img.url)
    }

  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto; 

    //* precargo el objeto antes de ser insertado
    //* Nota : aqui no estamos cargando la relacion que se tiene con las imagenes
      const product = await this.productoRepository.preload({
        id: id,
        ...toUpdate,
        
      });
      if(!product) throw new NotFoundException(`Product with id: ${id} not found`);

      //*createQueryRunner : trabaja de la mano con las transacciones, 
      //*si algo falla en la transacción el queryRunner no se jecuta
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect(); //* Nos onectamos a una BD
      await queryRunner.startTransaction() //* Iniciamos la transacción
      try {

      //* si vienen imagenes lo primero que hago es limpiar las imagenes de ese producto
      if(images){
       await queryRunner.manager.delete(ProductImage, {
        product:{id:id}
       });

       product.images = images.map( image => this.productoImgRepository.create({url: image}))

      }
      await queryRunner.manager.save(product) //*Aqui aun no esta impactando a la bd todavía
      await queryRunner.commitTransaction(); //*Si no ha dado ningun error, genera un commit  y ejecuta la transacción
      await queryRunner.release();

     // await  this.productoRepository.save(product);
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction(); //* Hace un rollback en caso falle la transacción
       await queryRunner.release(); //* Cierra la conexión
      this.handleDBExceptions(error)
    }
  }



  async remove(id: string) {
    const product = await this.productoRepository.delete({id})
    if(product.affected === 0) throw new NotFoundException(`Producto con ${id} no encontrado`)

    return product
  }

  async deleteAllProduct(){
    const query = this.productoRepository.createQueryBuilder('product');
    try {
        return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  private handleDBExceptions(error:any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs!!')

  }
}
