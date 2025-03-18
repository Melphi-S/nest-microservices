import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthDto } from './dto/auth.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('AUTH') private readonly authClient: ClientKafka,
    @Inject('POSTS') private readonly postsClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.authClient.subscribeToResponseOf('register');
    this.authClient.subscribeToResponseOf('login');
    this.postsClient.subscribeToResponseOf('getPosts');
  }

  @Post('register')
  register(@Body() body: AuthDto): Observable<any> {
    return this.authClient.send('register', body);
  }

  @Post('login')
  login(@Body() body: AuthDto): Observable<any> {
    return this.authClient.send('login', body);
  }

  @UseGuards(JwtGuard)
  @Get('posts')
  getPosts(): Observable<any> {
    return this.postsClient.send('getPosts', {});
  }
}
