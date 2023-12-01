import { Injectable } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';
import { MongoDBService } from './mongodb.service';

@Injectable()
export class QueueListenerService {
  private client: ServiceBusClient;

  constructor(private readonly mongoDBService: MongoDBService) {
    this.client = new ServiceBusClient(
      process.env.AZURE_SERVICE_BUS_CONNECTION_STRING,
    );
  }

  async startListening(queueName: string) {
    const receiver = this.client.createReceiver(queueName, 'receiveAndDelete');

    receiver.subscribe({
      processMessage: this.processMessage.bind(this),
      processError: this.processError.bind(this),
    });
  }

  async processMessage(message: any): Promise<void> {
    try {
      // Process the message and store it in MongoDB
      console.log('Received message:', message.body);
      await this.mongoDBService.saveMessage(JSON.parse(message.body));
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  async processError(err: any): Promise<void> {
    console.error('Error occurred in the Queue Listener:', err);
  }
}
