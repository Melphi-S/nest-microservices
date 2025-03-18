import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthDto } from './dto/auth.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH') private readonly authClient: ClientProxy,
    @Inject('POSTS') private readonly postsClient: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() body: AuthDto): Observable<any> {
    return this.authClient.send({ cmd: 'register' }, body);
  }

  @Post('login')
  login(@Body() body: AuthDto): Observable<any> | undefined {
    return this.authClient.send({ cmd: 'login' }, body);
  }

  @UseGuards(JwtGuard)
  @Get('posts')
  getPosts(): Observable<any> {
    return this.postsClient.send({ cmd: 'getPosts' }, {});
  }
}
