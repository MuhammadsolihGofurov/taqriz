import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gofurovmuhammadsolih004@gmail.com',
        pass: 'oyxb nplu qigt hgcf',
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verifyLink = `${process.env.BASE_URL}/api/v1/auth/confirm-email?token=${token}`;
    await this.transporter.sendMail({
      from: 'Taqriz <your_email@gmail.com>',
      to,
      subject: 'Elektron pochtangizni tasdiqlang!',
      html: `
        <h2>Elektron pochtani tasdiqlash</h2>
        <p>Quyidagi linkni bosish orqali elektron pochtangizni tasdiqlashingiz mumkin:</p>
        <a href="${verifyLink}">${verifyLink}</a>
      `,
    });
  }
}
