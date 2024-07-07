import { Body, Controller, HttpStatus, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckoutBodyDto } from 'src/api/stripe.api';
import { PaymentService } from './payment.service';

const logger = new Logger('Payment Controller')

@Controller('payment')
@UseGuards(AuthGuard('basic'))
export class PaymentController {

    constructor(
        private _paymentService: PaymentService
    ) { }

    @Post('create')
    async createPayment(@Res() res, @Body() body: CheckoutBodyDto) {
        logger.debug('Create Payment');

        const response = await this._paymentService.createPayment(body);

        if (!response.success) return res.status(HttpStatus.BAD_REQUEST).json(response.data);

        res.status(HttpStatus.CREATED);
        res.send(response.data);
    }

}
