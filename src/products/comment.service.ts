import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UpdateCategoryDto } from './dtos/create-category.dto';
import { CommentRepo } from './comment.repo';
import {
  CreateProductCommentDto,
  GetProductCommentsDto,
} from './dtos/comment-product-dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepo: CommentRepo) {}

  async createComment(payload: CreateProductCommentDto, userId: number) {
    try {
      const comment = await this.commentRepo.create(payload, userId);
      return comment;
    } catch (error) {
      console.log('error', error);
      throw new ServiceUnavailableException(
        'Comment failed',
        JSON.stringify(error),
      );
    }
  }

  async updateComment(id: number, payload: UpdateCategoryDto) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) {
      throw new NotFoundException('Category not found');
    }
    try {
      const updatedComment = Object.assign(comment, payload);
      await this.commentRepo.update(id, updatedComment);
      return updatedComment;
    } catch (error) {
      throw new ServiceUnavailableException('Update category failed');
    }
  }

  async deleteCategory(id: number) {
    const comment = await this.commentRepo.findById(id);
    if (!comment) {
      throw new NotFoundException('Category not found');
    }
    await this.commentRepo.delete(id);
    return comment;
  }

  async getByProductId(params: GetProductCommentsDto) {
    try {
      const comments = await this.commentRepo.findByProductId(
        params?.productId,
      );
      return comments;
    } catch (error) {
      console.log('get comments by product error', error);
    }
  }

  async clearAllComments() {
    return this.commentRepo.clearAll();
  }
}
