import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { EventHubService } from './modules/app/services/event-hub.service';
import { QueueListenerService } from './modules/app/services/queue-listener.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const evenHubService = app.get(EventHubService);
  await evenHubService.startListening();

  const queueListenerService = app.get(QueueListenerService);
  await queueListenerService.startListening('queue_name');

  await app.listen(process.env.PORT);
}

void bootstrap();
