import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostsService {
  constructor(private readonly httpService: HttpService) {}

  async getPosts(): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/posts'),
    );
    return data;
  }
}
