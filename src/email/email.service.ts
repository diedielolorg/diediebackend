import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import { Inject, Injectable } from '@nestjs/common';
import emailConfig from 'src/config/emailConfig';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class EmailService {
  sendMail(arg0: { to: any; subject: string; text: string }) {
    throw new Error('Method not implemented.');
  }
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async sendMemberJoinVerification(emailAddress: string) {
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      text: '123',
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
