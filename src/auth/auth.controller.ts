import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorators';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/get-rowheaders.decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators';

//*ApiTags : Permite dar un nombre a de cabecera al controlador para swagger 
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  //*Este check-auth-status : nos va a servir para hacer un refresh token
  @Get('check-auth-status')
  //todo: algo
  @Auth()
  checkAuthStatus(@GetUser() user: User){
    console.log(user)
    return this.authService.checkAuthStatus(user)
  }



  //* Ejemplo de como restringir accesos por autenticación y creación de custom decorator
  @Get('private')
  //* UseGuards : Es un decorador que nos sirve como un guardian de rutas, esto restringe la ruta dependiendo del argumento que se le pase
  //* AuthGuard : es un guard q nos proporciona passport este identifica la estrategia que definimos por defecto
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //* Decorador de parametro personalziado
    @GetUser() user: User,
    @GetUser('email') UserEmail: string,
    @GetRawHeaders() rawHeaders: string[],
    // @Req() request : Express.Request
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      UserEmail,
      rawHeaders,
    };
  }

  //* Ejemplo de como restringir accesos por roles y reacion de custom guards
  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  //* Ejemplo de como restringir accesos por roles usando un custom decorador (RoleProtected), y un custom guard (UserRoleGuard)
  @Get('private3')
  //*RoleProtected: es un decorador que me va a permitir retornar la metadata asignada
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  //*UserRoleGuard : es un guard que con ayuda de Reflector me va a permitir leer esta metadata asignada e mi decorador.
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private4')
  @Auth()
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute4(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
