import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _script, verify } from 'crypto';
import { promisify } from 'util';
import { ICreateUserPayload } from './dtos/create-user.dto';
import { ISignInUserPayload } from './dtos/sign-in-user.dto';
import { IForgotPasswordPayload } from './dtos/forgot-password.dto';
import { OtpService } from '../notification/otp.service';
import { IVerifyOtpPayload } from './dtos/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(
    private userUservice: UsersService,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async signup(payload: ICreateUserPayload) {
    const { password, phoneNumber, username } = payload;
    const users = await this.userUservice.find(phoneNumber);

    if (users?.length) {
      throw new BadRequestException(
        'Phone number is in use, please try another',
      );
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const notifyResponse = await this.otpService.sendOtpCode({
      phoneNumber: payload.phoneNumber,
    });

    if (!!notifyResponse) {
      const user = await this.userUservice.create({
        ...payload,
        password: result,
      });
      return user;
    } else {
      throw new ServiceUnavailableException(
        'Service unavailble, please try later',
      );
    }
  }

  async signin(payload: ISignInUserPayload) {
    const { phoneNumber, password } = payload;
    const [user] = await this.userUservice.find(phoneNumber);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified == false) {
      const response = await this.otpService.sendOtpCode({
        phoneNumber: user.phoneNumber,
      });

      if (response) {
        throw new UnauthorizedException({
          errorCode: 410,
          message:
            'We have sent an otp to your phone number, please verify to login to your account',
        });
      } else {
        throw new ServiceUnavailableException(
          'Cannot login right now, please try later',
        );
      }
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

  async verifyOtp(payload: IVerifyOtpPayload) {
    const { otpCode, phoneNumber } = payload;

    const [user] = await this.userUservice.find(phoneNumber);

    if (!user) {
      throw new BadRequestException('Email is in use, try another');
    }

    const isVerify = await this.otpService.verifyOtpCode(payload);

    if (isVerify) {
      const verifyUser = await this.userUservice.create({
        ...user,
        isVerified: true,
      });

      return verifyUser;
    } else {
      throw new BadRequestException('OTP is not correct');
    }
  }

  async forgotPassword(payload: IForgotPasswordPayload) {
    const { phoneNumber } = payload;
    const [user] = await this.userUservice.find(phoneNumber);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notifyResponse = await this.otpService.sendOtpCode({
      phoneNumber: payload.phoneNumber,
    });

    return notifyResponse;
  }
}
