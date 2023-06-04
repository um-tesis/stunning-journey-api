import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';
import { getClientUrlOrNgrok, getSiteUrl } from '../utils';

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
        success: `${getClientUrlOrNgrok(true)}/thank-you`,
        failure: `${getClientUrlOrNgrok(true)}/projects/${projectSlug}`,
        pending: `${getClientUrlOrNgrok(true)}/projects/${projectSlug}`,
      },
      auto_return: 'all',
      notification_url: `${getSiteUrl()}/api/donations/webhook`,
      external_reference: projectSlug,
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
      back_url: `${getSiteUrl()}/thank-you`,
      external_reference: projectSlug,
      payer_email: payerEmail,
      reason: `Suscripción mensual a: ${title}`,
      status: 'pending',
    });
  }
}
