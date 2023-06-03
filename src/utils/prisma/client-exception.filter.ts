import { ArgumentsHost, Catch } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ExternalExceptionFilter } from '@nestjs/core/exceptions/external-exception-filter';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends ExternalExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    // prettier-ignore
    switch (exception.code) {
    case 'P2002': {
      const target = exception.meta.target[0] as string;
      exception.message = `A unique constraint would be violated on: '${target}'.`;
      super.catch(exception, host);
      break;
    }
    default:
      // default 500 error code
      super.catch(exception, host);
      break;
    }
    // prettier-ignore
  }
}
