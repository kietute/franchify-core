import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { VerifyOtpDto } from './dtos/verify-otp.dto';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/profile')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: SignInUserDto) {
    const user = await this.authService.signin(body);
    return user;
  }

  @Put('/profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Body() body: { savePoints: number },
  ) {
    return this.authService.updateProfile(user.id, body);
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const verifiedUser = await this.authService.verifyOtp({
      phoneNumber: body.phoneNumber,
      otpCode: body.otpCode,
    });

    return verifiedUser;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { phoneNumber: string }) {
    await this.authService.forgotPassword({ phoneNumber: body.phoneNumber });
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }
}
