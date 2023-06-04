import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';
import { getClientUrl, getSiteUrlOrNgrok } from '../utils';

@Injectable()
export class MercadoPagoService {
  private configureMercadoPago(accessToken: string) {
    mercadopago.configure({
      access_token: accessToken,
    });
  }

  async createPreference(projectSlug: string, accessToken: string, title: string, price: number) {
    this.configureMercadoPago(accessToken);

    return await mercadopago.preferences.create({
      items: [
        {
          title,
          unit_price: price,
          quantity: 1,
        },
      ],
      back_urls: {
        success: `${getClientUrl()}/thank-you`,
        failure: `${getClientUrl()}/projects/${projectSlug}`,
        pending: `${getClientUrl()}/projects/${projectSlug}`,
      },
      auto_return: 'all',
      notification_url: `${getSiteUrlOrNgrok()}/api/donations/webhook`,
      external_reference: `${projectSlug}`,
    });
  }

  async createPreapproval(projectSlug: string, accessToken: string, title: string, price: number, payerEmail: string) {
    this.configureMercadoPago(accessToken);

    return await mercadopago.preapproval.create({
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: price,
        currency_id: 'UYU',
      },
      back_url: `${getSiteUrlOrNgrok(true)}/thank-you`,
      external_reference: `${projectSlug}`,
      payer_email: payerEmail,
      reason: `Suscripción mensual a: ${title}`,
      status: 'pending',
    });
  }
}
