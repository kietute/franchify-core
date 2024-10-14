import { Expose, Exclude } from 'class-transformer';

export class AdminDto {
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
  role: string;

  @Expose()
  addresses: Array<any>;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
