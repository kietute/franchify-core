import {
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

enum CategoryPropertyType {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
}

class CategoryPropertyDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(CategoryPropertyType)
  type: CategoryPropertyType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: Array<string>;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryPropertyDto)
  properties?: CategoryPropertyDto[];
}
