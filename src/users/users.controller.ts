import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInUserDto } from './dtos/sign-in-user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersSerice: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  whoAmI() {
    return 'Hello from the auth controller';
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user?.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: SignInUserDto, @Session() session: any) {
    const user = await this.authService.signin(body);
    session.userId = user?.id;
    return user;
  }
}
