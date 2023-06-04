import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { DonationsService } from './donations.service';
import { BaseDonation, Donation, DonationPagination } from './entities/donation.entity';
import { CreateDonationInput } from './dto/create-donation.input';
import { CreateDonorInput } from '../donors/dto/create-donor.input';
import { DonorsService } from '../donors/donors.service';
import { Donor } from '../donors/entities/donor.entity';
import { MercadoPagoService } from '../common/services/mercadopago.service';
import { CreatePreferenceInput } from './dto/create-preference.input';
import { ProjectsService } from '../projects/projects.service';
import { GenericError } from '../../utils/errors';
import { Preference } from './entities/preference.entity';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { Payment } from './entities/payment.entity';

@Resolver(() => Donation)
export class DonationsResolver {
  constructor(
    private readonly donationsService: DonationsService,
    private readonly donorsService: DonorsService,
    private readonly projectsService: ProjectsService,
    private readonly mpService: MercadoPagoService,
  ) {}

  @Query(() => DonationPagination, { name: 'donationsByProject' })
  async findAllByProjectId(@Args('projectId', { type: () => Int }) projectId: number, @Args() args: PaginationArgs) {
    const res = await this.donationsService.findAllByProjectId(projectId, args);
    return { donations: res.donations, total: res.total };
  }

  @Query(() => DonationPagination, { name: 'donationsByOrganization' })
  async findAllByOrganizationId(
    @Args('organizationId', { type: () => Int }) organizationId: number,
    @Args() args: PaginationArgs,
  ) {
    const res = await this.donationsService.findAllByOrganizationId(organizationId, args);
    return { donations: res.donations, total: res.total };
  }

  @Query(() => Donation, { name: 'donation' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.donationsService.findOne(id);
  }

  @Query(() => Payment, { name: 'paymentInfo' })
  async getPaymentInfo(@Args('paymentId') paymentId: number, @Args('projectSlug') projectSlug: string) {
    const { mpAccessToken } = await this.projectsService.findOneInternalBySlug(projectSlug);
    const { body } = await this.mpService.getPaymentInfo(paymentId, mpAccessToken);

    return {
      id: body.id,
      status: body.status,
      amount: body.transaction_amount,
      amountReceived: body.transaction_details.net_received_amount,
      externalReference: body.external_reference,
      payer: {
        firstName: body.payer.first_name,
        lastName: body.payer.last_name,
        email: body.payer.email,
        identificationType: body.payer.identification.type,
        identificationNumber: body.payer.identification.number,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        phone: `(${body.payer.phone.area_code}) ${body.payer.phone.number}`,
      },
      card: {
        cardHolderName: body.card.cardholder.name,
        firstSixDigits: body.card.first_six_digits,
        lastFourDigits: body.card.last_four_digits,
        expirationMonth: body.card.expiration_month,
        expirationYear: body.card.expiration_year,
      },
      paymentMethodId: body.payment_method_id,
      paymentTypeId: body.payment_type_id,
    };
  }

  @Mutation(() => BaseDonation)
  async createDonation(
    @Args('createDonationInput') createDonationInput: CreateDonationInput,
    @Args('createDonorInput') createDonorInput: CreateDonorInput,
  ) {
    const donor: Donor = await this.donorsService.create(createDonorInput);

    return this.donationsService.create(createDonationInput, donor.id);
  }

  @Mutation(() => Donation)
  updateDonation(@Args('id', { type: () => Int }) id: number, @Args('status') status: string) {
    return this.donationsService.update({ id, status });
  }

  @Mutation(() => Preference)
  async createPreference(@Args('createPreferenceInput') createPreferenceInput: CreatePreferenceInput) {
    const { amount, projectSlug } = createPreferenceInput;
    const { mpAccessToken, name } = await this.projectsService.findOneInternalBySlug(projectSlug);
    const donationName = `Donación a: ${name}`;

    try {
      const { body } = await this.mpService.createPreference(projectSlug, mpAccessToken, donationName, amount);
      return {
        id: body.id,
        initPoint: body.init_point,
        externalReference: body.external_reference,
      };
    } catch (e: any) {
      throw new GenericError(e?.message as string);
    }
  }

  @ResolveField()
  donor(@Parent() { donorId }: Donation) {
    return this.donorsService.findOne(donorId);
  }

  @ResolveField()
  project(@Parent() { projectId }: Donation) {
    return this.donationsService.getProject(projectId);
  }
}
