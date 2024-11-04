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
      relations: this.getRecursiveRelations('replies', 5), // Adjust the depth as needed
    });
  }

  async findByProductId(productId: number) {
    const comments = await this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      // .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('comment.parentComment', 'parentComment')
      // .leftJoinAndSelect('replies.user', 'replies.user')
      // .leftJoinAndSelect('replies.replies', 'replies.replies')
      // .leftJoinAndSelect('replies.parentComment', 'replies.parentComment')
      .where('comment.productId = :productId', { productId })
      // .addSelect(this.getRecursiveRelations('replies', 5)) // Adjust the depth as needed
      .getMany();

    // Filter out comments that are replies to other comments
    return comments;
  }

  async clearAll() {
    return this.repo?.clear();
  }

  private getRecursiveRelations(relation: string, depth: number): string[] {
    const relations = [];
    for (let i = 1; i <= depth; i++) {
      const prefix = Array(i).fill(relation).join('.');
      relations.push(prefix);
      relations.push(`${prefix}.user`);
    }
    return relations;
  }
}
