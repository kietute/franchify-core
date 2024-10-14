import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { AdminDto } from './dtos/tenant.dto';
import { SignInStaffDto } from './dtos/signin-staff.dto';
import { User, UserRole } from 'src/entities/user.entity';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { TenantService } from './tenant.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UserDto } from '../auth/dtos/user.dto';
import { StaffGuard } from '../common/guards/staff.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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

  @Get('/users')
  @Serialize(UserDto)
  @UseGuards(StaffGuard)
  getAll(@CurrentUser() currentUser: User) {
    return this.tenantService.findAll(currentUser); // Không cần tham số phân trang
  }

  @Get(':id')
  @Serialize(UserDto)
  @UseGuards(StaffGuard)
  getUser(@Param('id') id: number, @CurrentUser() currentUser: User) {
    return this.tenantService.findOne(id, currentUser);
  }

  @Put(':id/lock')
  @Serialize(UserDto)
  @UseGuards(StaffGuard)
  async lockUser(@Param('id') id: number, @CurrentUser() currentUser: User) {
    return this.tenantService.lock(id, currentUser);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: number, @CurrentUser() currentUser: User) {
    return this.tenantService.remove(id, currentUser);
  }
}
