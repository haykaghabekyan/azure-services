import { Injectable } from '@nestjs/common';
import {
  earliestEventPosition,
  EventHubConsumerClient,
  PartitionContext,
  SubscriptionEventHandlers,
} from '@azure/event-hubs';
import * as process from 'process';

@Injectable()
export class EventHubService {
  private client: EventHubConsumerClient;

  constructor() {
    this.client = new EventHubConsumerClient(
      process.env.AZURE_EVENTHUB_CONSUMER_GROUP,
      process.env.AZURE_EVENTHUB_CONNECTION_STRING,
      process.env.AZURE_EVENTHUB_NAME,
    );
  }

  async startListening(): Promise<void> {
    const partitionsIds = await this.client.getPartitionIds();

    partitionsIds.forEach((partitionId: string) => {
      this.client.subscribe(
        partitionId,
        {
          processEvents: (events, context: PartitionContext) => {
            console.log('Received event count: ', events.length, context);
          },
          processError: (err, context: PartitionContext) => {
            console.log('Error: ', err, context);
          },
        } as SubscriptionEventHandlers,
        { startPosition: earliestEventPosition },
      );
    });
  }
}
