import { Module } from '@nestjs/common';
import { StripeApiService } from 'src/api/stripe.api';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [],
  controllers: [
    PaymentController
  ],
  providers: [
    PaymentService,
    {
      provide: StripeApiService,
      useFactory: () => {
        return new StripeApiService(
          process.env.STRIPE_PRIVATE_KEY
        )
      },
      inject: []
    }
  ]
})
export class PaymentModule { }
