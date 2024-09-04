import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { StaffDto } from './dtos/tenant.dto';
import { AuthService } from 'src/auth/auth.service';
import { SignInStaffDto } from './dtos/signin-staff.dto';
import { UsersService } from 'src/auth/users.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UserRole } from 'src/entities/user.entity';
import { CreateStaffDto } from './dtos/create-staff.dto';

@Controller('tenant')
export class TenantController {
  constructor(
    private authService: AuthService,
    userService: UsersService,
  ) {}

  @UseGuards(AdminGuard)
  @Post('/create-staff')
  async createUser(@Body() body: CreateStaffDto) {
    const user = await this.authService.signup({
      ...body,
      role: UserRole.STAFF,
    });
    return user;
  }

  @Post('/signin')
  @Serialize(StaffDto)
  async signin(@Body() body: SignInStaffDto) {
    const user = await this.authService.signin(body);
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }
}
