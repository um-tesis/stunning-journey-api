import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';
import config from '../../config';

const { CLIENT_URL, CLIENT_URL_PROD, NODE_ENV, SITE_URL_PROD, SITE_URL, SERVER_PORT, NGROK_URL } = config;

@Injectable()
export class MercadoPagoService {
  private configureMercadoPago(accessToken: string) {
    mercadopago.configure({
      access_token: accessToken,
    });
  }

  async createPreference(projectId: number, accessToken: string, title: string, price: number) {
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
        failure: `${getClientUrl()}/projects/${projectId}`,
        pending: `${getClientUrl()}/projects/${projectId}`,
      },
      auto_return: 'all',
      notification_url: `${getSiteUrl()}/api/donations/webhook`,
      external_reference: `${projectId}`,
    });
  }

  async createPreapproval(projectId: number, accessToken: string, title: string, price: number, payerEmail: string) {
    this.configureMercadoPago(accessToken);

    return await mercadopago.preapproval.create({
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: price,
        currency_id: 'UYU',
      },
      back_url: `${NGROK_URL}/thank-you`,
      external_reference: `${projectId}`,
      payer_email: payerEmail,
      reason: `Suscripción mensual a: ${title}`,
      status: 'pending',
    });
  }
}

const getClientUrl = () => {
  if (NODE_ENV === 'production') {
    return CLIENT_URL_PROD;
  }

  return CLIENT_URL;
};

const getSiteUrl = () => {
  if (NODE_ENV === 'production') {
    return SITE_URL_PROD;
  }

  return SITE_URL.replace('${SERVER_PORT}', SERVER_PORT);
};
