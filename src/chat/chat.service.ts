import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom } from './schemas/chat-room.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
  ) {}

  async createRoom(name: string): Promise<ChatRoom> {
    const newRoom = new this.chatRoomModel({
      roomId: uuidv4(),
      name,
      participants: [],
      status: 'lobby',
      participantCount: 0,
    });
    return newRoom.save();
  }

  async getLobbyRooms(): Promise<ChatRoom[]> {
    return this.chatRoomModel.find({ status: 'lobby' }).exec();
  }

  async addParticipant(roomId: string, userId: string): Promise<ChatRoom> {
    const updatedRoom = await this.chatRoomModel.findOneAndUpdate(
      { roomId },
      { 
        $addToSet: { participants: userId },
        $inc: { participantCount: 1 }
      },
      { new: true },
    ).exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room ${roomId} not found`);
    }
    return updatedRoom;
  }

  async removeParticipant(roomId: string, userId: string): Promise<ChatRoom> {
    const updatedRoom = await this.chatRoomModel.findOneAndUpdate(
      { roomId },
      { 
        $pull: { participants: userId },
        $inc: { participantCount: -1 }
      },
      { new: true },
    ).exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room ${roomId} not found`);
    }
    return updatedRoom;
  }

  async getRoom(roomId: string): Promise<ChatRoom> {
    const room = await this.chatRoomModel.findOne({ roomId }).exec();
    if (!room) {
      throw new NotFoundException(`Room ${roomId} not found`);
    }
    return room;
  }
}