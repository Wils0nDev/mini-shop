import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnetedClients {                     
    [id:string] : {
        socket : Socket,
        user : User
    }
}

/** Ejemplo de la interface ConnetedClients
{                     
    "wqasdas3sadd" : {
        socket : Socket,
        user : User
    },
    "fdsfdsfdsfdsfds" : {
        socket : Socket,
        user : User
    }
}

 */

@Injectable()
export class MessageWsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository  : Repository<User>
    ){}

    private connetedClients : ConnetedClients = {}

    //*Aqui registraremos los  clientes conectado
    async registerCliente (client: Socket, userId:string){
        const user  = await this.userRepository.findOneBy({id : userId})
        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User not active');
        this.checkUserConnection(user);
        this.connetedClients[client.id] = { //mi "id" apunta al socket y al usuario que le corresponde
            socket : client,
            user: user
        };
    }

    //* Aqui removemos nuestra lista de ids de clientes, el cliente enviado
    removeClient(clienteId: string){
        delete this.connetedClients[clienteId]
    }

    //*Con esto podemos saber cuantos clientes estan conectados
    getConnectedClients() : string[]{
        return Object.keys(this.connetedClients)
      }

      getUserFullNameBySocketId(socketId : string){
        return this.connetedClients[socketId].user.fullName
      }

      checkUserConnection(user: User){
        for (const clientId of Object.keys(this.connetedClients)) {
            const connectedClient = this.connetedClients[clientId]
            if(connectedClient.user.id === user.id){
                connectedClient.socket.disconnect();
                break;
            }
        }
      }
}
