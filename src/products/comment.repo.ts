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
      relations: [
        'replies',
        'replies.user',
        'replies.replies', // Include nested replies if any
        'replies.replies.user', // Load users of nested replies
      ],
    });
  }

  async findByProductId(productId: number) {
    return this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('replies.user', 'replies.user')
      .where('comment.productId = :productId', { productId })
      .getMany();
  }
}
