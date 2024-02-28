<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# MiniShop API

1. Clonar proyecto
2. ejecutar ```yarn install```
3. Clonar archivo env.template y renombrarlo a .env
4. Cambiar las variables de entorno.
5. Levantar la BD
```docker-compose up -d```
6. Ejecutar SEED
   ``` http://localhost:3000/api/seed ``` 

7. Levatar aplicación ```yarn start:dev ``` 
  * Si en caso sale error de conexión, "Crear bd".

## Librerias

- class-transformer , class-validator : Para validar nuestros DTOs.
- @nestjs/config  : Para poder configurar variables de entorno
- @nestjs/mongoose, mongoose : Para trabajar con BD MongoDB
- axios : Para hacer peticiones http a nuesto Api de Pokemon
- @nestjs/typeorm : ORM que nos permite trabajar con BD relacionales.
- pg : librería que nos permite hacer uso de bd PostgreSQL


## Stack usado
* PostgreSQL : (TablePlus, ide para BD)
* NestJS
* Postman
* Docker Desktop

# Temas

1.  TypeOrm : Es un ORM que se puede ejecutar en las plataformas NodeJS, este nos ORM nos va a servir para poder trabajar con BD PostgreSQL.
2. Validaciones : Uso de class-validator y class-transformer.
3. CRUD contra base de datos : (GET, POST, PATCH, DELETE).
4. Schemas : Usando la libería de typeorm.
5. DTOs y sus extensiones.
6. Paginación : Uso de QueryParams y PaginationDto, y los metodos limit y skyp.
7. Patron Repository : Este patron ya viene agregado en type ORM para poder hacer uso de el. 
    * createQueryBuilder : Nos permite crear consultas desde el lenguaje "T-SQL"

8. Importación de Módulo :  exportamos nuestro MongooseModule para poder hacer uso de los modelos.

9. ConfigModule : Es un módulo que importamos en el app.module, este nos permite obtener las variables de entorno configuradas en en nuestro env.config, que a su vez obtiene las variables configuradas en el .env. 

10. TypeOrmModule.forRoot : hacemos uso del modulo de TypeORM para generar la conexión a bd de PostgreSQL

11. Docker: Docker nos sirve para crear contenedores con todo lo necesario que nuestra aplicación necesita para ser instalado en un servidor

12. # Transacciones
12. DataSource  : 
13. QueryRunner : Proporciona una única conexión de base de datos
14. Transacciones 

