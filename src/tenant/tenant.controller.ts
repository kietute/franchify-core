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
import { TenantSignInReponseDto, CreateTenantConfigDto } from './dtos';
import { SignInStaffDto } from './dtos';
import { User, UserRole } from 'src/entities/user.entity';
import { CreateStaffDto } from './dtos';
import { TenantService } from './tenant.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UserDto } from '../auth/dtos/user.dto';
import { StaffGuard } from '../common/guards/staff.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from 'src/auth/users.service';
import { classToPlain } from 'class-transformer';
import { ManagerGuard } from 'src/common/guards/manager.guard';

@Controller('tenant')
export class TenantController {
  constructor(
    private tenantService: TenantService,
    private userService: UsersService,
  ) {}

  @UseGuards(ManagerGuard)
  @Serialize(TenantSignInReponseDto)
  @Post('/create-staff')
  async createStaff(@Body() body: CreateStaffDto) {
    const user = await this.userService.create({
      ...body,
    });
    return user;
  }

  @UseGuards(AdminGuard)
  @Serialize(TenantSignInReponseDto)
  @Post('/create-manager')
  async createManager(@Body() body: CreateStaffDto) {
    const user = await this.userService.create({
      ...body,
    });
    return user;
  }

  @Post('/signin')
  @Serialize(TenantSignInReponseDto)
  async signin(@Body() body: SignInStaffDto) {
    const user = await this.tenantService.signIn(body);
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/staffs/:storeId')
  @Serialize(UserDto)
  @UseGuards(StaffGuard)
  getStaffs(@Param('storeId') storeId) {
    return this.tenantService.getAllStaff(storeId);
  }

  @Get('/users')
  @Serialize(UserDto)
  @UseGuards(AdminGuard)
  getUsers() {
    return this.tenantService.getAll();
  }

  @Put('/users/:id')
  @Serialize(UserDto)
  @UseGuards(AdminGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() payload: Omit<User, 'password'>,
  ) {
    return this.userService.update(id, payload);
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

  @Put('/config')
  async updateConfig(@Body() body: CreateTenantConfigDto) {
    try {
      const tenantConfig = await this.tenantService.updateTenant(body);
      return tenantConfig;
    } catch (error) {
      console.log('Update tenant config error', error);
      throw new ServiceUnavailableException('Update tenant config error');
    }
  }
}
