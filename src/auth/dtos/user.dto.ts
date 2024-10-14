import { Expose, Exclude } from 'class-transformer';

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
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  isActive: boolean;

  @Expose()
  role: string;

  @Expose()
  addresses: Array<any>;
}
