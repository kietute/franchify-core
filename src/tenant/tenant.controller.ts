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

  @Get('/theme')
  async getTheme() {
    const screens = {
      phone: '600px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1270px',
      television: '1600px',
    };

    const content = [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/apps/(main)/**/*.{js,ts,jsx,tsx}',
      './src/containers/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
      './src/components/atoms/**/*.{js,ts,jsx,tsx}',
      './src/components/molecules/**/*.{js,ts,jsx,tsx}',
      './src/components/organisms/**/*.{js,ts,jsx,tsx}',
      './src/components/templates/**/*.{js,ts,jsx,tsx}',
      './src/layouts/**/*.{js,ts,jsx,tsx}',
      './src/designs/**/*.{js,ts,jsx,tsx}',
    ];

    const colors = {
      primary: {
        '50': '#FEF3E6',
        '100': '#FEE4C8',
        '200': '#FDC991',
        '300': '#FBB05F',
        '400': '#FA9528',
        '500': '#E57905',
        '600': '#B96104',
        '700': '#8C4A03',
        '800': '#5A2F02',
        '900': '#2D1801',
        '950': '#190D01',
      },
      secondary: {
        '50': '#FFFFFF',
        '100': '#FFFFFF',
        '200': '#FFFFFF',
        '300': '#FFFFFF',
        '400': '#FFFFFF',
        '500': '#FFFFFF',
        '600': '#CCCCCC',
        '700': '#999999',
        '800': '#666666',
        '900': '#333333',
        '950': '#1A1A1A',
      },
      green: {
        '50': '#E9FBF0',
        '100': '#CFF7DE',
        '200': '#9FEFBC',
        '300': '#6FE69B',
        '400': '#40DE7A',
        '500': '#22C55E',
        '600': '#1B9D4B',
        '700': '#147538',
        '800': '#0D4E25',
        '900': '#072713',
        '950': '#04160A',
      },
    };

    return `
/** @type {import('tailwindcss').Config} */

const screens = ${JSON.stringify(screens, null, 2)};

module.exports = {
  content: ${JSON.stringify(content, null, 2)},
  theme: {
    extend: {
      screens,
      colors: ${JSON.stringify(colors, null, 2)},
    },
  },
  plugins: [],
};
`;
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
