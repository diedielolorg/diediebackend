import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // 네이버 메일 서비스 설정
      auth: {
        user: process.env.EMAIL_ADDRESS, // 네이버 이메일 계정
        pass: process.env.EMAIL_AUTH_PASSWORD, // 네이버 이메일 비밀번호
      },
    });
  }

  async generateRandomCode(): Promise<number> {
    let str = '';
    for (let i = 0; i < 4; i++) {
      str += Math.floor(Math.random() * 10);
    }
    return +str;
  }

  async sendConfirmationEmail(email: string): Promise<void> {
    const authcode = await this.generateRandomCode();
    console.log(authcode);
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_ADDRESS, // 보내는 이메일 주소
      to: email, // 받는 이메일 주소
      subject: '인증 메일', // 이메일 제목
      html: `인증번호 4자리입니다 ${authcode}`, // 인증 링크 포함한 HTML 내용
    };

    console.log(mailOptions);
    return await this.transporter.sendMail(mailOptions);
  }
}
