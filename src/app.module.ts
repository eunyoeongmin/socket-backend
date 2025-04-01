import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://mymongo:1234@cluster0.ltogx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
  ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}