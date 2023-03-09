import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Resolver()
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Mutation(() => Boolean)
  async postContactForm(@Args('contactInput') contactDto: ContactDto) {
    return await this.contactService.sendContactForm(contactDto);
  }
}
