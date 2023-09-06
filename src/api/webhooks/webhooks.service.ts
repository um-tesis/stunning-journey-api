import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { MercadoPagoService } from '../common/services/mercadopago.service';
import { ProjectsService } from '../projects/projects.service';
import { DonationsService } from '../donations/donations.service';
import { DonorsService } from '../donors/donors.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { FrequencyInterval } from '@prisma/client';
import { BillingsService } from '../billings/billings.service';

const PLATFORM_FEE = 0.05;
const MAX_FEE = 100;
const MP_FEE = 0.0599;

export enum MercadoPagoTopics {
  PAYMENT = 'payment',
  SUBSCRIPTION = 'subscription_preapproval',
}

export enum MercadoPagoActions {
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_UPDATED = 'payment.updated',
  SUBSCRIPTION_CREATED = 'subscription_preapproval.created',
  SUBSCRIPTION_UPDATED = 'subscription_preapproval.updated',
}

@Injectable()
export class WebhooksService {
  constructor(
    private prisma: PrismaService,
    private mpService: MercadoPagoService,
    private projectsService: ProjectsService,
    private donationsService: DonationsService,
    private donorsService: DonorsService,
    private subscriptionsService: SubscriptionsService,
    private billingsService: BillingsService,
  ) {}

  private calculateNetTransactionAmount(amount: number) {
    const fee = Math.floor(amount * PLATFORM_FEE);
    return { amount: amount - (fee > MAX_FEE ? MAX_FEE : fee), fee };
  }

  async handlePayment(paymentId: number, projectSlug: string, action: MercadoPagoActions) {
    const project = await this.projectsService.findOneInternalBySlug(projectSlug);

    try {
      const { body } = await this.mpService.getPaymentInfo(paymentId, project.mpAccessToken);

      /* eslint-disable */
      switch (action) {
        case MercadoPagoActions.PAYMENT_CREATED: {
          await this.createPayment(body, project, paymentId);
          break;
        }
        case MercadoPagoActions.PAYMENT_UPDATED: {
          await this.donationsService.updateByPaymentId({ status: body.status }, `${paymentId}`);
          break;
        }
      }
      /* eslint-enable */

      return body;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async handleSubscription(preapprovalId: string, projectSlug: string, action: MercadoPagoActions) {
    const project = await this.projectsService.findOneInternalBySlug(projectSlug);

    try {
      const { body } = await this.mpService.getPreapprovalInfo(`${preapprovalId}`, project.mpAccessToken);

      /* eslint-disable */
      switch (action) {
        case MercadoPagoActions.SUBSCRIPTION_CREATED: {
          await this.createSubscription(body, project, preapprovalId);
          break;
        }
        case MercadoPagoActions.SUBSCRIPTION_UPDATED: {
          await this.subscriptionsService.updateByMpSubscriptionId({ status: body.status }, preapprovalId);
          break;
        }
      }
      /* eslint-enable */

      return body;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private async createSubscription(body: any, project: any, preapprovalId: string) {
    const netAmountPreviousPlatformFee = (body.auto_recurring.transaction_amount * 100) / (1 + MP_FEE);
    const { amount, fee } = this.calculateNetTransactionAmount(netAmountPreviousPlatformFee);

    await this.subscriptionsService.create({
      amount,
      frequency: body.auto_recurring.frequency,
      frequencyInterval: FrequencyInterval.MONTHLY,
      payerEmail: body.payer_email,
      projectId: project.id,
      status: body.status,
      mpSubscriptionId: preapprovalId,
    });

    await this.updateBilling(fee, project);
  }

  private async createPayment(body: any, project: any, paymentId: number) {
    const donor = await this.donorsService.create({
      email: body.payer?.email,
      identification: body.payer?.identification?.number || body.card.cardHolder?.identification?.number,
      identificationType: body.payer?.identification?.type || body.card.cardHolder?.identification?.type,
      firstName: body.payer?.first_name || body.card?.cardHolder?.name,
      lastName: body.payer?.last_name,
      phone: body.payer?.phone?.number,
      cardStart: body.card?.first_six_digits,
      paymentMethod: body.payment_method?.type || body.payment_type_id,
    });
    console.log('Donor created', donor.id);

    const { amount, fee } = this.calculateNetTransactionAmount(body.transaction_details.net_received_amount * 100);

    await this.donationsService.create(
      {
        amount,
        projectId: project.id,
        status: body.status,
        paymentId: `${paymentId}`,
      },
      donor.id,
    );

    console.log('Donation created', paymentId);

    await this.updateBilling(fee, project);

    console.log('Billing updated');
  }

  private async updateBilling(fee: number, project: any) {
    const billing = await this.billingsService.findOneUnpaidByProjectId(project.id as number);

    if (!billing) return;

    await this.billingsService.update(billing.id, {
      amount: billing.amount + fee,
    });
  }
}
