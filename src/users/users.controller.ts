import { Controller, Get, Query } from '@nestjs/common';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAllUser(@Query() query) {
    // const listUser = this.userService.
  }
}
