import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
