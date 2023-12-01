import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { EventHubService } from './services/event-hub.service';
import { ServiceBusService } from './services/service-bus.service';
import { QueueListenerService } from './services/queue-listener.service';
import { MongoDBService } from './services/mongodb.service';
import { Message, MessageSchema } from './models/message.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'integration', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string(),
        AZURE_EVENTHUB_CONSUMER_GROUP: Joi.string(),
        AZURE_EVENTHUB_NAME: Joi.string(),
        AZURE_EVENTHUB_CONNECTION_STRING: Joi.string(),
        AZURE_SERVICE_BUS_CONNECTION_STRING: Joi.string(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URI, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), // Register the Message model
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EventHubService,
    ServiceBusService,
    QueueListenerService,
    MongoDBService,
  ],
})
export class AppModule {}
