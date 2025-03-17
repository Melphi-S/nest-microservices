import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('posts-service')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern({ cmd: 'getPosts' })
  async getPosts() {
    const posts = await this.postsService.getPosts();
    return posts;
  }
}
