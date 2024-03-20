import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    //*Este servicio es proporcionado por el JwtModule q esta importado en nuestro auth.module
    private readonly jwtService : JwtService
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userDate } = createUserDto;
      const passwordByCrypt = bcrypt.hashSync(password, 10);
      const user = this.userRepository.create({
        ...userDate,
        password: passwordByCrypt,
      });
      const usuario = await this.userRepository.save(user);
      return usuario;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, fullName: true, roles: true, id: true },
    });
    if (!user)
      throw new UnauthorizedException(`Usuario o contraseña incorrecta`);

    const isPassword = await bcrypt.compareSync(password, user.password);
    if (!isPassword)
      throw new UnauthorizedException(`Usuario o contraseña incorrecta`);
    
    //* Hacemos esto para no mostrar el password
    const userReturn = new User();
    userReturn.id = user.id;
    userReturn.email = user.email;
    userReturn.fullName = user.fullName;
    userReturn.roles = user.roles;
    return {
      ...userReturn,
      token: this.getJwtToken({
        id : user.id
      })
    };
  }

  async checkAuthStatus(user:User){
    return {
      ...user,
      token: this.getJwtToken({
        id : user.id
      })
    };
  }

  private getJwtToken(payload: JwtPayload ){
    const token = this.jwtService.sign(payload);
    return token
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs!!',
    );
  }
}
