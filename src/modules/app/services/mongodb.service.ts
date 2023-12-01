import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Message } from '../models/message.model';

@Injectable()
export class MongoDBService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async saveMessage(message: any) {
    const newMessage = new this.messageModel(message);
    return newMessage.save();
  }
}
