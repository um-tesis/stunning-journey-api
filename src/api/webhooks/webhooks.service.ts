import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { MercadoPagoService } from '../common/services/mercadopago.service';
import { ProjectsService } from '../projects/projects.service';
import { DonationsService } from '../donations/donations.service';
import { DonorsService } from '../donors/donors.service';

// const PLATFORM_FEE = 0.02;
// const MAX_FEE = 20;

export enum MercadoPagoTopics {
  PAYMENT = 'payment',
  SUBSCRIPTION = 'subscription_preapproval',
}

export enum MercadoPagoActions {
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_UPDATED = 'payment.updated',
}

@Injectable()
export class WebhooksService {
  constructor(
    private prisma: PrismaService,
    private mpService: MercadoPagoService,
    private projectsService: ProjectsService,
    private donationsService: DonationsService,
    private donorsService: DonorsService,
  ) {}

  // private calculateFee(amount: number) {
  //   const fee = amount * PLATFORM_FEE;
  //   const finalAmount = amount - (fee > MAX_FEE ? MAX_FEE : fee);
  //   // TODO: Add fee to platform account
  // }

  async handlePayment(paymentId: number, projectSlug: string, action: MercadoPagoActions) {
    const project = await this.projectsService.findOneInternalBySlug(projectSlug);

    try {
      const { body } = await this.mpService.getPaymentInfo(paymentId, project.mpAccessToken);

      /* eslint-disable */
      switch (action) {
      case MercadoPagoActions.PAYMENT_CREATED: {
        const donor = await this.donorsService.create({
          userId: body.payer?.id,
          email: body.payer?.email,
          identification: body.payer?.identification?.number || body.card.cardHolder?.identification?.number,
          identificationType: body.payer?.identification?.type || body.card.cardHolder?.identification?.type,
          firstName: body.payer?.first_name || body.card?.cardHolder?.name,
          lastName: body.payer?.last_name,
          phone: body.payer?.phone?.number,
          cardStart: body.card?.first_six_digits,
          paymentMethod: body.payment_method?.type || body.payment_type_id,
        });

        await this.donationsService.create({
          amount: body.transaction_details.net_received_amount * 100,
          projectId: project.id,
          status: body.status,
        }, donor.id);

        break;
      }
      case MercadoPagoActions.PAYMENT_UPDATED:
        console.log('Update payment');
        break;
      }
      /* eslint-enable */

      return body;
    } catch (error) {
      return error;
    }
  }
}
