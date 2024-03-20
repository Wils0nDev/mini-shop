import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {

  constructor(
    //*Inyectamos nuestro servicio, pero para esot ProducModule debe exportar su servicio.
    //* Y SeedModule, Importar el ProductModule
    private readonly productsService : ProductsService,
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ){}

  async runSeed() {
    await this.deleteTables()
    const adminUser = await this.insertUsers()
    await this.insertNewProducts(adminUser)
    return `Seed Executed`
  }

 private async deleteTables(){
  await this.productsService.deleteAllProduct();
  const queryBuilder = this.userRepository.createQueryBuilder();
  await queryBuilder
  .delete()
  .where({})
  .execute()

 }

 private async insertUsers(){
   const seedUsers = initialData.users;
   
   //* Usaremos Insert de multiples insercciones
   const users: User[] =[];

   seedUsers.forEach((user)=>{
    const { password, ...userDate } = user;
      const passwordByCrypt = bcrypt.hashSync(password, 10);
    users.push(this.userRepository.create({...userDate, password: passwordByCrypt})) //* preparo mi arreglo de de instancia de usarios a insertar
   });
   const dbUsers = await this.userRepository.save(users)
   return dbUsers[0];
 }

 private async insertNewProducts(user:User){

  //* Eliminamos todos los productos
  //this.productsService.deleteAllProduct();

  //*Obtenemos nuestros productos que vienen desde data
  const products = initialData.products;
  //* Creamos un array de promesas
  const insertPromises = [];

  //* Recorremos los productos y vamos creando instancias de productoDto y lo insertamos en el array
  products.forEach(product =>{
    insertPromises.push(this.productsService.create(product,user))
  });
//* Por ultimo ejecutamos todas las promesas
 await Promise.all(insertPromises);
  return true
 }

}
