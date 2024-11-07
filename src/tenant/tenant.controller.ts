import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  ServiceUnavailableException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { AdminDto, CreateTenantConfigDto } from './dtos';
import { SignInStaffDto } from './dtos';
import { User, UserRole } from 'src/entities/user.entity';
import { CreateStaffDto } from './dtos';
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
    return this.tenantService.getAll(currentUser); // Không cần tham số phân trang
  }

  @Get('/config')
  async getConfig() {
    try {
      const tenantConfig = await this.tenantService.getTenant();
      if (!tenantConfig) {
        throw new NotFoundException('Tenant config not found');
      } else {
        return tenantConfig;
      }
    } catch (error) {
      console.log('Get tenant config error', error);
      throw new ServiceUnavailableException('Tenant config not found');
    }
  }

  @Post('/config')
  async createConfig(@Body() body: CreateTenantConfigDto) {
    try {
      const tenantConfig = await this.tenantService.createTenant(body);
      return tenantConfig;
    } catch (error) {
      console.log('Create tenant config error', error);
      throw new ServiceUnavailableException('Create tenant config error');
    }
  }

  @Get(':id')
  @Serialize(UserDto)
  @UseGuards(StaffGuard)
  getUser(@Param('id') id: number, @CurrentUser() currentUser: User) {
    return this.tenantService.getById(id, currentUser);
  }

  @Put(':id/lock')
  @Serialize(UserDto)
  @UseGuards(StaffGuard)
  async lockUser(@Param('id') id: number, @CurrentUser() currentUser: User) {
    return this.tenantService.lockById(id, currentUser);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: number, @CurrentUser() currentUser: User) {
    return this.tenantService.deleteById(id, currentUser);
  }
}
