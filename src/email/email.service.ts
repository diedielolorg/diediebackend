import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  constructor() {
    // Transporter 초기화
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: +process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_AUTH_PASSWORD,
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

  async sendConfirmationEmail(email: string): Promise<string> {
    try {
      const authcode = await this.generateRandomCode();
      console.log(authcode);
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_ADDRESS, // 보내는 이메일 주소
        to: email, // 받는 이메일 주소
        subject: 'DIEDIE 인증 메일', // 이메일 제목
        html: `인증번호 4자리입니다 ${authcode}`, // 인증 링크 포함한 HTML 내용
      };
      console.log(mailOptions);
      await this.transporter.sendMail(mailOptions);
      return '이메일 발송에 성공하였습니다.';
    } catch (error) {
      console.error(error);
      return '실패';
    }
  }
}
