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
      if (!email) {
        throw new BadRequestException('이메일을 입력 해주세요');
      }
      console.log(authcode);
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_ADDRESS, // 보내는 이메일 주소
        to: email, // 받는 이메일 주소
        subject: 'DIEDIE 인증 메일', // 이메일 제목
        html: `인증번호 4자리입니다 ${authcode}`, // 인증 링크 포함한 HTML 내용
      };
      await this.transporter.sendMail(mailOptions);

      await this.cacheManager.set(email, authcode, 300000);

      return { msg: '인증번호 발송 완료' };
    } catch (error) {
      console.error(error);
    }
  }

  async reSendConfirmationEmail(email: string): Promise<any> {
    try {
      const authcode: string = await this.generateRandomCode();
      if (!email) {
        throw new BadRequestException('이메일을 입력 해주세요');
      }
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_ADDRESS, // 보내는 이메일 주소
        to: email, // 받는 이메일 주소
        subject: 'DIEDIE 인증 메일', // 이메일 제목
        html: `인증번호 4자리입니다 ${authcode}`, // 인증 링크 포함한 HTML 내용
      };
      await this.transporter.sendMail(mailOptions);

      const value = await this.cacheManager.get(email);
      if (value) {
        console.log('기존인증번호를 삭제합니다');
        await this.cacheManager.del(email);
      }
      await this.cacheManager.set(email, authcode, 300000);
      return { msg: '인증번호 재발송 완료' };
    } catch (error) {
      console.error(error);
    }
  }

  async verifyEmail(email: string, code: number): Promise<any> {
    const value = await this.cacheManager.get(email);
    if (value !== `${code}`) {
      throw new BadRequestException('인증번호가 일치하지 않습니다.');
    }
    return { msg: '인증번호 확인 완료' };
  }
}
