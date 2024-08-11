import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';
import { ICreateUserPayload } from './dtos/create-user.dto';
import { ISignInUserPayload } from './dtos/sign-in-user.dto';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private userUservice: UsersService) {}

  async signup(payload: ICreateUserPayload) {
    const { email, password } = payload;
    const users = await this.userUservice.find(email);

    if (users?.length) {
      throw new BadRequestException('Email is in use, try another');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    console.log('payload is', payload);

    const user = await this.userUservice.create({
      ...payload,
      password: result,
    });

    return user;
  }

  async signin(payload: ISignInUserPayload) {
    const { phoneNumber, password } = payload;

    

    const [user] = await this.userUservice.find(phoneNumber);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }
}
