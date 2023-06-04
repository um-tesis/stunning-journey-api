import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Donor } from '../../donors/entities/donor.entity';
import { Project } from '../../projects/entities/project.entity';
import { User } from 'src/api/users/entities/user.entity';

@ObjectType()
export class BaseDonation {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  donorId: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => Int)
  amount: number;

  @Field(() => String)
  mpPreferenceId: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;
}

@ObjectType()
export class Donation extends BaseDonation {
  @Field(() => Donor)
  donor: Donor;

  @Field(() => Project)
  project: Project;
}

@ObjectType()
export class DonationPagination {
  @Field(() => [Donation])
  donations: [Donation];

  @Field(() => Int)
  total: [User];
}
