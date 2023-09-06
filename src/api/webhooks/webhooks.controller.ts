import { Controller, Post, Body, Query } from '@nestjs/common';
import { MercadoPagoInput } from './dto/mercadopago.input';
import { MercadoPagoActions, WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('/mercadopago')
  create(@Query('cliente') clientSlug: string, @Body() webhookInfo: MercadoPagoInput) {
    const { action, data, type } = webhookInfo;
    if (!action) return null;

    let fullAction = action;
    if (action.indexOf('.') === -1) {
      fullAction = `${type}.${action}`;
    }

    console.log('fullAction', fullAction);
    console.log(webhookInfo);

    /* eslint-disable */
    switch (fullAction) {
      case MercadoPagoActions.PAYMENT_CREATED:
      case MercadoPagoActions.PAYMENT_UPDATED:
        return this.webhooksService.handlePayment(parseInt(data.id), clientSlug, action as MercadoPagoActions);
      case MercadoPagoActions.SUBSCRIPTION_UPDATED:
        return this.webhooksService.handleSubscription(data.id, clientSlug, fullAction as MercadoPagoActions);
      default:
        return null;
    }
    /* eslint-enable */
  }

  @Post('/mercadopago-admin')
  createAdmin(@Body() webhookInfo: MercadoPagoInput) {
    const { action, data } = webhookInfo;
    if (!action) return null;

    /* eslint-disable */
    switch (action) {
      case MercadoPagoActions.PAYMENT_CREATED:
      case MercadoPagoActions.PAYMENT_UPDATED:
        return this.webhooksService.handlePayment(parseInt(data.id), null, action as MercadoPagoActions);
      default:
        return null;
    }
    /* eslint-enable */
  }
}
