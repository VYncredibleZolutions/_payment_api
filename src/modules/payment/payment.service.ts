import { Injectable, Logger } from '@nestjs/common';
import { CheckoutBodyDto, StripeApiService } from 'src/api/stripe.api';


const logger = new Logger('Payment Service')


@Injectable()
export class PaymentService {
    constructor(
        private _stripeApiService: StripeApiService
    ) { }

    async createPayment(body: CheckoutBodyDto) {
        try {
            logger.debug('Create Payment');

            const response = await this._stripeApiService.generateCheckout({
                client_id: body.client_id,
                price_id: body.price_id,
                quantity: body.quantity,
                success_url: body.success_url
            });

            if (!response.success) throw new Error(response.data.message);

            return {
                success: true,
                data: response.data
            };
        } catch (err) {
            return {
                success: false,
                data: {
                    message: err.message
                }
            }
        }
    }
}
