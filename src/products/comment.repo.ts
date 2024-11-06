import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class CommentRepo {
  constructor(@InjectRepository(Comment) private repo: Repository<Comment>) {}

  create(payload: any, userId: number) {
    const comment = this.repo.create({
      ...payload,
      user: userId,
    } as any);
    return this.repo.save(comment);
  }

  update(id: number, comment: Comment) {
    return this.repo.update(id, comment);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }

  async findByProductId(productId: number) {
    const comments = await this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.parentComment', 'parentComment')
      .where('comment.productId = :productId', { productId })
      .getMany();

    return this.nestCommentsTogether(comments)?.filter(
      (comment) => !comment.parentComment,
    );
  }

  async clearAll() {
    return this.repo?.clear();
  }

  private nestCommentsTogether(comments: any[]): any[] {
    let results = comments;

    results?.map((comment) => {
      comment.replies = comments.filter(
        (reply) => reply.parentComment?.id === comment.id,
      );
      return comment;
    });

    return results;
  }
}
