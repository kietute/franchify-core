import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { AdminDto } from './dtos/tenant.dto';
import { SignInStaffDto } from './dtos/signin-staff.dto';
import { UserRole } from 'src/entities/user.entity';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { TenantService } from './tenant.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @UseGuards(AdminGuard)
  @Serialize(AdminDto)
  @Post('/create-staff')
  async createUser(@Body() body: CreateStaffDto) {
    const user = await this.tenantService.createStaff({
      ...body,
      role: UserRole.STAFF,
    });
    return user;
  }

  @Post('/signin')
  @Serialize(AdminDto)
  async signin(@Body() body: SignInStaffDto) {
    const user = await this.tenantService.signIn(body);
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }
}
