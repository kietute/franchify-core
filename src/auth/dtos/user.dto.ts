import { Expose, Type } from 'class-transformer';

class StoreDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  username: string;

  @Expose()
  savePoints: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  isActive: boolean;

  @Expose()
  role: string;

  @Expose()
  @Type(() => StoreDto)
  store: StoreDto;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  addresses: Array<any>;
}
