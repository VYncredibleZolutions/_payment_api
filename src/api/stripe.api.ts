import { Logger } from "@nestjs/common";
import Stripe from "stripe";

const logger = new Logger('Stripe API');

export class StripeApiService {
    private readonly apiStripe: Stripe;
    constructor(
        STRIPE_SECRET_KEY: string
    ) {
        this.apiStripe = new Stripe(
            STRIPE_SECRET_KEY,
            {
                apiVersion: '2024-06-20'
            }
        )
    }

    async generateCheckout(body: CheckoutBodyDto): Promise<CheckoutResponseDto> {
        try {
            const response = await this.apiStripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: body.price_id,
                    quantity: body.quantity || 1
                }],
                success_url: body.success_url,
                mode: 'subscription',
                client_reference_id: body.client_id
            });

            return {
                success: true,
                data: {
                    url: response.url
                }
            }
        } catch (err) {
            logger.error(err.stack);
            return {
                success: false,
                data: {
                    message: err.message
                }
            }
        }
    }
}

export interface CheckoutBodyDto {
    client_id: string;
    price_id: string;
    quantity?: number;
    success_url: string;
}

export interface CheckoutResponseDto {
    success: boolean;
    data: {
        url?: string;
        message?: string;
    }
}