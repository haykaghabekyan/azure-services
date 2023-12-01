import { Injectable } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';

@Injectable()
export class ServiceBusService {
  private serviceBusClient: ServiceBusClient;

  constructor() {
    this.serviceBusClient = new ServiceBusClient(
      process.env.AZURE_SERVICE_BUS_CONNECTION_STRING,
    );
  }

  async createQueue(queueName: string) {
    const sender = this.serviceBusClient.createSender(queueName);
    await sender.close();
  }

  async sendMessage(queueName: string, message: string) {
    const sender = this.serviceBusClient.createSender(queueName);

    try {
      // Send the message to the specified queue
      await sender.sendMessages({
        body: message,
      });
    } finally {
      await sender.close();
    }
  }
}
