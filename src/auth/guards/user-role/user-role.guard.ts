import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';


//*Los Guard : Usados para permitir o prevenir acceso a una ruta. Estos se encuentran dentro del Exception Zone.
//*Por lo tanto si este dispara algun error, podemos hacer uso de las excepciones de nestjs/common
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    //* Reflector: me permite ver información de la metadata del decorador donde se encuentra ubicado
    private readonly reflector : Reflector //* ver documentacion
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    //*Obtenglo los roles que yo defini en mi decorador
    const validRoles : string [] = this.reflector.get(META_ROLES,context.getHandler());
    //console.log(validRoles)

    const req = context.switchToHttp().getRequest();
    console.log(req.user)
    const user = req.user as User; 
    if(!user) throw new BadRequestException(`No se encontro el usuario (request)`)

    for (const roles of user.roles) {
      if(validRoles.includes(roles)){
        return true
      }
    }
    throw new ForbiddenException((
      `User ${user.fullName} need a valid roles: [${validRoles}]`
    ))
  }
}
