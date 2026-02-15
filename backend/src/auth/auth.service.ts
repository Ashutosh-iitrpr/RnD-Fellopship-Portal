import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class AuthService {
  private readonly mailer: Transporter;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    const port = Number(process.env.MAIL_PORT ?? '587');

    this.mailer = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port,
      secure: port === 465,
      auth:
        process.env.MAIL_USER && process.env.MAIL_PASS
          ? {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            }
          : undefined,
    });
  }

  async requestOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.otp.deleteMany({
      where: { email },
    });

    await this.prisma.otp.create({
      data: {
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const mailEnabled = process.env.MAIL_ENABLED === 'true';

    if (mailEnabled) {
      try {
        await this.mailer.sendMail({
          from: process.env.MAIL_FROM ?? process.env.MAIL_USER,
          to: email,
          subject: 'Your OTP Code',
          text: `Your OTP is ${otp}. It expires in 5 minutes.`,
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to send OTP email');
      }

      return { message: 'OTP sent to email' };
    }

    console.log(`[OTP] ${email}: ${otp}`);
    return { message: 'OTP generated and printed to console' };
  }

  async verifyOtp(email: string, code: string) {
    const record = await this.prisma.otp.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.prisma.otp.deleteMany({
      where: { email },
    });

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
