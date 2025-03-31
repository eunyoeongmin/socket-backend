import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatRoom extends Document {
  @Prop({ required: true, unique: true })
  roomId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  participants: string[];

  @Prop({ default: 'lobby' })
  status: 'active' | 'lobby' | 'archived';

  @Prop({ type: Number, default: 0 })
  participantCount: number;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);