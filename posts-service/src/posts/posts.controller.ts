import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('posts-service')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern('getPosts')
  async getPosts() {
    return await this.postsService.getPosts();
  }
}
