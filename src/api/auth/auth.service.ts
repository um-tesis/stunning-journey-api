import { Prisma, User } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { Token } from './entities/token.entity';
import { CreateUserInput } from './dto/create-user.input';
import * as fs from 'fs';
import * as ejs from 'ejs';
import path from 'path';

import config from '../config';
import { PrismaService } from 'nestjs-prisma';
import { transporter } from 'src/helpers/nodemailer.helper';

const { JWT_PRIVATE_KEY, JWT_EXPIRE_TIME, LIBERA_EMAIL_ACCOUNT } = config;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(payload: CreateUserInput): Promise<User> {
    let template;

    if (payload.role === 'USER') {
      template = fs.readFileSync(
        path.join(__dirname, '../../../src/helpers/email-templates/volunteerEmailTemplate.ejs'),
        'utf-8',
      );
    } else {
      template = fs.readFileSync(
        path.join(__dirname, '../../../src/helpers/email-templates/welcomeEmailTemplate.ejs'),
        'utf-8',
      );
    }
    const organization = await this.prisma.organization.findUnique({
      where: {
        id: payload.organizationId,
      },
    });

    const renderedTemplate = ejs.render(template, {
      name: payload.name,
      organizationName: organization.name,
    });

    const message = {
      from: LIBERA_EMAIL_ACCOUNT,
      to: payload.email,
      subject: 'Welcome to Libera!',
      html: renderedTemplate,
    };

    const hashedPassword = this.passwordService.hashPassword(payload.password);

    try {
      await transporter.sendMail(message);

      return await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Email ${payload.email} already used.`);
      }

      throw new Error(e?.message as string);
    }
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.role === 'USER') {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = this.passwordService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: JWT_PRIVATE_KEY,
      expiresIn: JWT_EXPIRE_TIME,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: JWT_PRIVATE_KEY,
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
