import { Logger } from "@nestjs/common";
import Stripe from "stripe";

const logger = new Logger('Stripe API');

export class StripeApiService {
    private readonly apiStripe: Stripe;
    private readonly stripe_webhook_key: string;
    constructor(
        STRIPE_SECRET_KEY: string,
        STRIPE_WEBHOOK_KEY: string
    ) {
        this.stripe_webhook_key = STRIPE_WEBHOOK_KEY
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

    async webhookProcess(request: WebhookPayloadDto, header: WebjookHeaderDto): Promise<CheckoutResponseDto> {
        logger.debug('Processing webhook request');

        const sig = header['stripe-signature'];

        logger.log(`Header stripe ${sig}`);

        // Handle the event
        switch (request.type) {
            case 'checkout.session.completed':
                const checkoutSessionCompleted = request.data.object;
                logger.log('checkoutSessionCompleted')
                // Then define and call a function to handle the event checkout.session.completed
                break;
            case 'customer.subscription.created':
                const customerSubscriptionCreated = request.data.object;
                logger.log('customerSubscriptionCreated')
                // Then define and call a function to handle the event customer.subscription.created
                break;
            case 'customer.subscription.updated':
                const customerSubscriptionUpdated = request.data.object;
                logger.log('customerSubscriptionUpdated')
                // Then define and call a function to handle the event customer.subscription.updated
                break;
            default:
                logger.log(`Unhandled event type ${request.type}`);
        }

        return {
            success: true,
            data: {
                message: 'Received event successfully'
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

export interface WebjookHeaderDto {
    host: string;
    'user-agent': string;
    'content-length': string;
    accept: string;
    'cache-control': string;
    'content-type': string;
    'stripe-signature': string;
    'accept-encoding': string;
}

export interface WebhookPayloadDto {
    id: string;
    object: string;
    api_version: string;
    created: number;
    data: {
        object: {
            id: string;
            object: string;
            after_expiration: any;
            allow_promotion_codes: any;
            amount_subtotal: number;
            amount_total: number;
            automatic_tax: any[];
            billing_address_collection: any;
            cancel_url: any;
            client_reference_id: string;
            client_secret: any;
            consent: any;
            consent_collection: any;
            created: number;
            currency: string;
            currency_conversion: any;
            custom_fields: [];
            custom_text: any[];
            customer: string;
            customer_creation: string;
            customer_details: any[];
            customer_email: any;
            expires_at: number;
            invoice: string;
            invoice_creation: any;
            livemode: boolean;
            locale: any;
            metadata: {};
            mode: string;
            payment_intent: any;
            payment_link: any;
            payment_method_collection: string;
            payment_method_configuration_details: any;
            payment_method_options: any[];
            payment_method_types: any[];
            payment_status: string;
            phone_number_collection: any[];
            recovered_from: any;
            saved_payment_method_options: any[];
            setup_intent: any;
            shipping_address_collection: any;
            shipping_cost: any;
            shipping_details: any;
            shipping_options: any[];
            status: string;
            submit_type: any;
            subscription: string;
            success_url: string;
            total_details: any[];
            ui_mode: string;
            url: any;
        }
    },
    livemode: boolean;
    pending_webhooks: number;
    request: { id: any, idempotency_key: any };
    type: string;
}