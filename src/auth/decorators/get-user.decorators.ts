import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const GetUser = createParamDecorator((data, ctx: ExecutionContext)=>{
    //data : son arguementos que podemos pasar 
    //ExecutionContext : es el contexto en el cual se esta ejecutan la función en este momento
   // const {email} = data
    
    const req = ctx.switchToHttp().getRequest();
    const user = req.user; 
    if(!user) throw new InternalServerErrorException(`No se encontro el usuario (request)`)
    if(!!data){

        return user[data]
    }else{
        return user
    }
    
});