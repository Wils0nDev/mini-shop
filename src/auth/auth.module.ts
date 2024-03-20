import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [ 
    //* Ya que vamos a usar nuestras variables de enterno tmb en nuestras strategies
    //* Es necesario que tmb pasemos el modulo de ConfigModule en los imports del auth.module
    ConfigModule,
    TypeOrmModule.forFeature([User]) ,
    //*PassportModule importamos el módulo para poder hace uso de sus estrategías en este caso usaremos el JWT 
    PassportModule.register({defaultStrategy: 'jwt'}),

    //* Módulos asincronos: aqui nos va a pertmir es que JwtModule se ejecute antes de cualquier otro modulo
    JwtModule.registerAsync({
      //*Usamos el modulo de ConfigModule para que la variable JWT_SECRET sea requerida
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory:(configService: ConfigService)=> {
        return {
            secret:configService.get('JWT_SECRET'),
            global: true,
            signOptions: {expiresIn : '1h'}
          }
      }
    }),

    //*Que pasaria si  process.env.JWT_SECRET no esta definido en el momento que la aplicación se esta montando.
    //* Entonces mejor hacer esto con módulos asincronos
    // JwtModule.register(
    //   {
      
    //   secret:process.env.JWT_SECRET,
    //   global: true,
    //   signOptions: {expiresIn : '1h'}
    // })
  ],
  exports:[TypeOrmModule,JwtStrategy, PassportModule, JwtModule]
})

export class AuthModule {}