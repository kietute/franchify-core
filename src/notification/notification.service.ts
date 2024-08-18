import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpCode } from '../entities/otp-code.dto';

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(OtpCode) private repo: Repository<OtpCode>) {}

  create(payload: { phoneNumber: string; url: string }) {
    const otp = this.repo.create({
      phoneNumber: payload.phoneNumber,
      verifyUrl: payload.url,
    });
    return this.repo.save(otp);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id: id });
  }

  find(phoneNumber: string) {
    return this.repo.findBy({ phoneNumber: phoneNumber });
  }

  async update(id: number, attrs: Partial<OtpCode>) {
    const otp = await this.findOne(id);
    if (!otp) {
      throw new NotFoundException('Not found OTP');
    }
    Object.assign(otp, attrs);
    return this.repo.save(otp);
  }

  remove(id: number) {
    if (!this.repo.findOneBy({ id: id })) {
      throw new NotFoundException('Not found otp');
    }
    return this.repo.delete({ id: id });
  }
}
