import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor(
    //*Inyectamos nuestro servicio, pero para esot ProducModule debe exportar su servicio.
    //* Y SeedModule, Importar el ProductModule
    private readonly productsService : ProductsService
  ){}

  async runSeed() {
    await this.insertNewProducts()
    return `Seed Executed`
  }

 private async insertNewProducts(){

  //* Eliminamos todos los productos
  this.productsService.deleteAllProduct();

  //*Obtenemos nuestros productos que vienen desde data
  const products = initialData.products;
  //* Creamos un array de promesas
  const insertPromises = [];

  //* Recorremos los productos y vamos creando instancias de productoDto y lo insertamos en el array
  products.forEach(product =>{
    insertPromises.push(this.productsService.create(product))
  });
//* Por ultimo ejecutamos todas las promesas
 await Promise.all(insertPromises);
  return true
 }

}
