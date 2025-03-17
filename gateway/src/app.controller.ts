import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthDto } from './dto/auth.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH') private readonly auth: ClientProxy,
    @Inject('POSTS') private readonly posts: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() body: AuthDto): Observable<any> {
    return this.auth.send({ cmd: 'register' }, body);
  }

  @Post('login')
  login(@Body() body: AuthDto): Observable<any> {
    return this.auth.send({ cmd: 'login' }, body);
  }

  @UseGuards(JwtGuard)
  @Get('posts')
  getPosts(): Observable<any> {
    return this.posts.send({ cmd: 'getPosts' }, {});
  }
}
