import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateStaffPayload } from './dtos/create-staff.dto';
import { UsersService } from 'src/auth/users.service';
import { randomBytes, scrypt as _script, verify } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { ISignInStaffPayload } from './dtos/signin-staff.dto';

const scrypt = promisify(_script);

@Injectable()
export class TenantService {
  constructor(
    private readonly userUservice: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  //Create staff service, doesn't need to verify phone number
  async createStaff(payload: ICreateStaffPayload) {
    const { password, phoneNumber } = payload;
    const users = await this.userUservice.find(phoneNumber);

    if (users?.length) {
      throw new BadRequestException(
        'Phone number is in use, please try another',
      );
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const user = await this.userUservice.create({
      ...payload,
      password: result,
    });

    return user;
  }

  async signIn(payload: ISignInStaffPayload) {
    const { phoneNumber, password } = payload;
    const [user] = await this.userUservice.find(phoneNumber);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException(
        'Phone number or password is not corrected',
      );
    }
    const jwtPayload = {
      id: user.id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    return {
      ...user,
      accessToken: this.jwtService.sign(jwtPayload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(jwtPayload, {
        expiresIn: '7d',
      }),
    };
  }
}
