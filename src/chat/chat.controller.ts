import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/rooms')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getRooms() {
    return this.chatService.getLobbyRooms();
  }

  @Post()
  async createRoom(@Body() body: { name: string }) {
    return this.chatService.createRoom(body.name);
  }
}