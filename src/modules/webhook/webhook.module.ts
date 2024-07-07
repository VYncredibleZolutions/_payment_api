import { Module } from '@nestjs/common';
import { StripeApiService } from 'src/api/stripe.api';
import { WebhookController } from './webhook.controller';

@Module({
  controllers: [WebhookController],
  providers: [
    {
      provide: StripeApiService,
      useFactory: () => {
        return new StripeApiService(
          process.env.STRIPE_PRIVATE_KEY,
          process.env.STRIPE_WEBHOOK_KEY
        )
      },
      inject: []
    }
  ]
})
export class WebhookModule { }
