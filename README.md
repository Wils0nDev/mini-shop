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
  * Si en caso sale error de conexión, "Crear BD de manera manual, ojo solo la BD".

## Librerias

- class-transformer , class-validator : Para validar nuestros DTOs.
- @nestjs/config  : Para poder configurar variables de entorno
- @nestjs/typeorm : ORM que nos permite trabajar con BD relacionales.
- pg : librería que nos permite hacer uso de bd PostgreSQL
-  @nestjs/serve-static : nos sirve para crear contenido estatico
- uuid : Nos servirara para renombrar nuestras imagenes con un identificador unico.
- @types/multer : Multer es un middleware de node.js para el manejo multipart/form-data, que se utiliza principalmente para cargar archivos .. mas información -> [Multer](https://github.com/expressjs/multer#multeropts)
* Auth:  
- @nestjs/passport passport passport-jwt
- @nestjs/jwt passport-jwt
- @types/passport-jwt

@nestjs/serve-static : Para servir contenido estático como una aplicación de página única (SPA).

## Stack usado
* PostgreSQL : (TablePlus, ide para BD)
* NestJS
* Postman
* Docker Desktop

# Temas

1.  TypeOrm : Es un ORM que se puede ejecutar en las plataformas NodeJS, este ORM nos va a servir para poder trabajar con BD PostgreSQL y ejecutar consultas asi como crear las tablas de manera sincronizada desde los schemas que este nos brinda. 

2. Validaciones : Uso de class-validator y class-transformer, que nos brinda decoradores para poder realizar validaciones a cada propiedad de nuestro modelo.

3. CRUD: (@GET, @POST, @PATCH, @DELETE) : decoradores del método de solicitud HTTP

4. Entity  : Entidad es una clase que se asigna a una tabla de base de datos (o colección cuando se usa MongoDB). Puede crear una entidad definiendo una nueva clase y marcándola con @Entity()

5. DTO (Data Transfer Object) : es un patrón de diseño de software utilizado para transferir datos entre subsistemas de una aplicación. Su objetivo es encapsular un conjunto de datos relacionados en una única estructura para facilitar su transporte de un lugar a otro, como entre diferentes capas de una aplicación o entre sistemas distribuidos.


6. Paginación : Uso de QueryParams y PaginationDto, y los metodos limit y skyp.

7. Patron Repository :  Este patrón se utiliza para separar las preocupaciones relacionadas con el acceso a los datos de las capas de negocio y presentación de una aplicación. Este patron ya viene agregado en TypeORM para poder hacer uso de el. 
    * createQueryBuilder : Nos permite crear consultas desde el lenguaje "T-SQL"

8. Importación de Módulo :  importamos  TypeOrmModule para poder hacer uso de las entidades, al igual que importamos ProductModule para poder hacer uso de sus servicios. 

8. Exportación de servicios :  exportamos los servicios de ProductModule para hacer uso de este dentro de otros modulos

9. ConfigModule : Es un módulo que importamos en el app.module, este nos permite obtener las variables de entorno configuradas en en nuestro env.config, que a su vez obtiene las variables configuradas en el .env. 

10. TypeOrmModule.forRoot : hacemos uso del modulo de TypeORM para generar la conexión a bd de PostgreSQL

## Transacciones
   - Una transacción generalmente representa cualquier cambio en una base de datos, pero estas son confiables ya que si algo llega a fallar, el proceso se llega a revertir dejando la bd en el estado anterior.
   Mas información -> [Transacciones en NestJS](https://docs.nestjs.com/techniques/database#typeorm-transactions)


12. DataSource  : Su interacción con la base de datos solo es posible una vez que haya configurado un archivo DataSource. TypeORM DataSource mantiene la configuración de conexión de su base de datos y establece una conexión de base de datos inicial o un grupo de conexiones según el RDBMS que utilice.

13. QueryRunner :  se utiliza para ejecutar consultas SQL directamente y manejar transacciones.

14. Upload File(img): Para manejar la carga de archivos, Nest proporciona un módulo integrado basado en el paquete de middleware multer para Express
Más información sobre lo que usamos (UseInterceptors,FileInterceptor, etc) en -> [File upload con NestJS](https://docs.nestjs.com/techniques/file-upload#basic-example)

15. Docker: Docker nos sirve para crear contenedores con todo lo necesario que nuestra aplicación necesita para ser instalado en un servidor

## Autenticación con Passport 
Passport es la biblioteca de autenticación de node.js más popular, bien conocida por la comunidad y utilizada con éxito en muchas aplicaciones de producción. Es sencillo integrar esta biblioteca con una aplicación Nest@nestjs/passport usando el módulo. A alto nivel, Passport ejecuta una serie de pasos para:

Autenticar a un usuario verificando sus "credenciales" (como nombre de usuario/contraseña, token web JSON ( JWT ) o token de identidad de un proveedor de identidad)
Administrar el estado autenticado (emitiendo un token portátil, como un JWT, o creando una sesión Express )
Adjunte información sobre el usuario autenticado al Requestobjeto para su uso posterior en controladores de ruta
  - PassportModule.register : importamos el módulo para poder uso de sus estrategías en este caso usaremos el JWT 
  - JwtModule.registerAsync: Es un módulo que nos va a permitir hacer uso de los JWT al momento de que el usuario se autentique, registerAsync nos permite cargar el modulo de manera asincrona, para que inicique antes de cualquier otro modulo.
  JwtModule al ser un modulo, nos permite importar, exportar , etc como cualquier otro modulo. Pero es la propiedad de useFactory donde obtenemos la llave secreta, el tiempo de expiración, etc. 

  - ConfigModule : Usammos el modulo de ConfigModule para que la variable JWT_SECRET sea requerida


## JwtStrategy
  Implementamos nuestra estrategía que nos va a permirtir validar la autenticación del usuario, este extiende de PassportStrategy


## Guards 
Una guard es una clase anotada con el @Injectable() decorador, que implementa la CanActivate interfaz.
Los guardias tienen una única responsabilidad . Determinan si una solicitud determinada será manejada por el controlador de ruta o no, dependiendo de ciertas condiciones (como permisos, roles, ACL, etc.) 

- @UseGuards  : Este decorador tiene un alcance de controlador, puede tomar un solo argumento o una lista de argumentos separados por comas. Esto le permite aplicar fácilmente el conjunto de protecciones adecuado con una sola declaración.

- AuthGuard : es un guard q nos proporciona passport este identifica la estrategia que definimos por defecto

## Custom Property ParamDecorator
   - Decorado personalizado : Podemos crear nuestros propis decoradores de parametros para poder retornar algo despues de realizar alguna funcionalidad
     -  @GetUser : Es nuestro decorador personalizado que nos retorna los datos del usuario en caso el usuario se haya autenticado, Si bien es cierto esto lo pudimos hacer con el Requeste.Express, esta es una forma mas elegante de retornar valores.


## OpenApi
  - OpenAPI es un formato de definición independiente del idioma que se utiliza para describir las API RESTful.
  - En pocas palabras OpenApi nos ayuda a poder documentar nuestras API RESTFull y esto lo hace con ayuda de la herramienta de ``Swagger`` 