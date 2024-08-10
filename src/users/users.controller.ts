import { Controller, Get, SerializeOptions } from '@nestjs/common';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

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
}
