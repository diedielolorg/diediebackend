import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
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

  async generateRandomCode(): Promise<string> {
    let str = '';
    for (let i = 0; i < 4; i++) {
      str += Math.floor(Math.random() * 10);
    }
    return str;
  }

  async sendConfirmationEmail(email: string): Promise<any> {
    try {
      const authcode = await this.generateRandomCode();
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_ADDRESS, // 보내는 이메일 주소
        to: email, // 받는 이메일 주소
        subject: 'DIEDIE 인증 메일', // 이메일 제목
        html: `인증번호 4자리입니다 ${authcode}`, // 인증 링크 포함한 HTML 내용
      };
      await this.transporter.sendMail(mailOptions);
      //입력받은 코드 redis에 폰번이랑 code 저장 ttl설정
      await this.cacheManager.set(authcode, email, 0.5);
      return { msg: '인증번호 발송 완료' };
    } catch (error) {
      console.error(error);
    }
  }

  async verifyEmail(code: number): Promise<any> {
    //받은 코드 Redis에서 조회
    const value = await this.cacheManager.get(String(code));
    if (value === null) {
      throw new BadRequestException(`인증번호가 일치하지 않습니다.`);
    }
    return { msg: '인증번호 확인 완료' };
  }
}
