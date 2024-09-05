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
  text = 'string',
}

class CategoryPropertyDto {
  @IsString()
  name: string;

  @IsEnum(CategoryPropertyType)
  type: CategoryPropertyType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: Array<string>;
}

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryPropertyDto)
  property: CategoryPropertyDto[];
}
