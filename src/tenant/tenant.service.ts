import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateStaffPayload } from './dtos/create-staff.dto';
import { UsersService } from 'src/auth/users.service';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { ISignInStaffPayload } from './dtos/signin-staff.dto';
import { User, UserRole } from '../entities/user.entity';

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

    if (user.role == 'user') {
      throw new ForbiddenException('User cannot login to admin site');
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

    console.log('user', user);

    return {
      ...user,
      accessToken: this.jwtService.sign(jwtPayload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(jwtPayload, {
        expiresIn: '7d',
      }),
    };
  }
  async findAll(currentUser: User) {
    if (currentUser.role === UserRole.STAFF) {
      return this.userUservice.findAllByRole(UserRole.USER); // Staff chỉ xem User
    }

    return this.userUservice.findAll();
  }

  async findOne(id: number, currentUser: User) {
    if (!id) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userUservice.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra vai trò của currentUser
    if (
      currentUser.role === UserRole.STAFF &&
      (user.role === UserRole.ADMIN || user.role === UserRole.STAFF)
    ) {
      throw new ForbiddenException('You are not allowed to view this user.');
    }

    return user;
  }
  async remove(id: number, currentUser: User) {
    const user = await this.userUservice.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra nếu người dùng hiện tại đang tự xóa chính mình
    if (currentUser.id === user.id) {
      throw new BadRequestException('You cannot remove your own account.');
    }

    // Xóa user nếu không phải là chính mình
    return this.userUservice.remove(id);
  }
  async lock(id: number, currentUser: User) {
    const user = await this.userUservice.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra nếu người dùng hiện tại đang cố gắng khóa chính mình
    if (currentUser.id === user.id) {
      throw new BadRequestException('You cannot lock your own account.');
    }

    // Kiểm tra quyền của người dùng hiện tại
    if (currentUser.role === UserRole.STAFF) {
      // Staff không thể khóa Admin hoặc Staff
      if (user.role === UserRole.STAFF || user.role === UserRole.ADMIN) {
        throw new BadRequestException(
          'Staff cannot lock Admin or other Staff accounts.',
        );
      }
    }

    // Khóa tài khoản
    return this.userUservice.lock(id);
  }
}
