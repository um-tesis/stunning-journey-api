import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { ContactDto, EmailVolunteers } from './dto/contact.dto';

@Resolver()
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Mutation(() => Boolean, { name: 'postContactForm' })
  async postContactForm(@Args('contactInput') contactDto: ContactDto) {
    return await this.contactService.sendContactForm(contactDto);
  }

  @Mutation(() => Boolean, { name: 'emailVolunteers' })
  async emailVolunteers(@Args('emailVolunteersInput') emailVolunteersInput: EmailVolunteers) {
    return await this.contactService.emailVolunteers(emailVolunteersInput);
  }

  @Mutation(() => Boolean, { name: 'subscribeToNewsletter' })
  async subscribeToNewsletter(@Args('email') email: string) {
    return await this.contactService.subscribeToNewsletter(email);
  }
}
