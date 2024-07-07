import { Body, Controller, Headers, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { StripeApiService } from 'src/api/stripe.api';

const logger = new Logger('Webhook Controller')

@Controller('webhook')
export class WebhookController {
    constructor(private _stripeApiService: StripeApiService) { }

    @Post('')
    async webhookMessage(@Res() res, @Body() body: any, @Headers() headers) {
        logger.debug('Web Hook Payment');

        const response = await this._stripeApiService.webhookProcess(body, headers);

        if (!response.success) return res.status(HttpStatus.BAD_REQUEST).json(response.data);

        res.status(HttpStatus.OK); // You need status code 200 for the webhook to accept the request
        res.send('Successfully created');
    }
}
