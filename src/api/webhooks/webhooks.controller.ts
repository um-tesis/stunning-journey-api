import { Controller, Post, Body, Query } from '@nestjs/common';
import { MercadoPagoInput } from './dto/mercadopago.input';
import { MercadoPagoActions, WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('/mercadopago')
  create(@Query('cliente') clientSlug: string, @Body() webhookInfo: MercadoPagoInput) {
    const { action, data } = webhookInfo;
    if (!action) return null;

    return this.webhooksService.handlePayment(parseInt(data.id), clientSlug, action as MercadoPagoActions);
  }
}
