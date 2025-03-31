import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  // 사용자 연결 종료 시 처리
  async handleDisconnect(client: Socket) {
    const rooms = Array.from(client.rooms).filter(room => room !== client.id);
    for (const roomId of rooms) {
      await this.handleLeaveRoom(client, roomId);
      this.server.emit('roomUpdated', await this.chatService.getRoom(roomId));
    }
  }

  // 방 생성
  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, roomName: string) {
    const newRoom = await this.chatService.createRoom(roomName);
    this.server.emit('roomCreated', newRoom);
  }

  // 방 입장
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomId: string) {
    try {
      const updatedRoom = await this.chatService.addParticipant(roomId, client.id);
      client.join(roomId);
      this.server.emit('roomUpdated', updatedRoom); // 모든 클라이언트에게 방 정보 업데이트
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  // 방 퇴장
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, roomId: string) {
    try {
      const updatedRoom = await this.chatService.removeParticipant(roomId, client.id);
      client.leave(roomId);
      this.server.emit('roomUpdated', updatedRoom); // 모든 클라이언트에게 방 정보 업데이트
    } catch (error) {
      client.emit('error', error.message);
    }
  }
}
