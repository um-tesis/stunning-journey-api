import { Field, HideField, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { BaseEntity } from '../../common/entities/base.entity';

@ObjectType()
export class User extends BaseEntity {
  @Field()
  name: string;

  @Field()
  email: string;

  @HideField()
  password: string;

  @Field(() => Role)
  role: Role;

  @Field({ nullable: true })
  phone: string;

  @Field(() => Int, { nullable: true })
  organizationId: number;
}

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class OrgAdminPagination {
  @Field(() => [User])
  admins: [User];

  @Field(() => Int)
  total: number;
}
