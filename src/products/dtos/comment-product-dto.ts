import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateProductCommentDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  productId: number;

  @IsString()
  @Type(() => String)
  content: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  parentComment: number;
}

export class GetProductCommentsDto {
  @Type(() => Number)
  @IsNumber()
  productId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number;
}

export class UserSerializer {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;
}

export class CommentSerializer {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => CommentSerializer)
  replies: CommentSerializer[];

  @Expose()
  @Type(() => CommentSerializer)
  parentComment: CommentSerializer;

  @Expose()
  @Type(() => Number)
  parentId: number;

  @Expose()
  @Type(() => UserSerializer)
  user: UserSerializer;
}

export class ParentCommmentSerializer {
  @Expose()
  id: number;
}

export class ProductCommentSerializer {
  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose({ name: 'replies' })
  @Type(() => CommentSerializer)
  replies: CommentSerializer[];

  @Expose()
  @Type(() => ParentCommmentSerializer)
  parentComment: ParentCommmentSerializer;

  @Expose()
  id: number;

  @Expose()
  @Type(() => UserSerializer)
  user: UserSerializer;
}
