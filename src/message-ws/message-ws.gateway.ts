import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

//* namespace : lo podemos ver como una sala de chat, cuando las personas se conectan
//* al servidor, lo q estan haciendo es conectarse al namespace del root (/), pero tambien se puede 
//* definir un namespace, ejemplo ('/productos')

//* El cliente que se conecta tiene un identificador único, entonces el websocke sabe cual es tu identificador
//* Por lo tanto  cuando el cliente se conecta a dos namespace,
//* 1 - el nombre general del namespace (producto),
//* 2 - se conecta a una sala de chata con el id que tiene ese socket, el cual es unico y volátil ,
//* este identificador permite que se pueda mandar un mensaje solo a esa único cliente.

//*OnGatewayConnection,OnGatewayDisconnect : interfaces que me permiten saber cuando un cliente se conecta y se desconecta.

//@WebSocketGateway({cors: true, namespace:'/products' })
@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  //* WebSocketServer : tiene la información de todos los clientes conectcados
  @WebSocketServer() wss : Server; 
  constructor(private readonly messageWsService: MessageWsService,
              //*Inyectamos jwtService que viene desde el modulo de Auth
              //*Ya que AuthModule importa JwtModule
              private readonly jwtService : JwtService
              //*JwtService : nos permite virificar si el token logueado es valido
              ) {}
  async handleConnection(client: Socket, ...args: any[]) {
    
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      //*Verificando el token, podemos obtener el id del usuario
      payload = this.jwtService.verify(token);
      console.log({payload})
      await this.messageWsService.registerCliente(client, payload.id)

    } catch (error) {
      console.log({error})

      client.disconnect();
      return ;
    }
    //console.log({payload});
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())
    //console.log({connected: this.messageWsService.getConnectedClients()})
    
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id)
    //console.log({connected: this.messageWsService.getConnectedClients()})
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())

  }

  //*SubscribeMessage : decorador que espera el nombre del evento que va a escuchar
  //* Aqui escuchamos el evento que emite el cliente
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto){

    //! Emite unicamente al cliente.
    // client.emit('message-from-server',{
    //   fullName : 'Soy Yo!',
    //   message : payload.message || 'no-message!!'
    // });
    
     //! Emitir a todos menos al cliente inical.
    // client.broadcast.emit('message-from-server',{
    //   fullName : 'Soy Yo!',
    //   message : payload.message || 'no-message!!'
    // });
    
    //! Emitir a todos incluyendo al cliente
    console.log({client})
    this.wss.emit('message-from-server',{
        fullName : this.messageWsService.getUserFullNameBySocketId(client.id),
        message : payload.message || 'no-message!!'
      });

  }

  
}
