import { Field, ArgsType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetOrganizationDto {
  @Field(() => ID)
  @IsUUID()
  orgId: string;
}
