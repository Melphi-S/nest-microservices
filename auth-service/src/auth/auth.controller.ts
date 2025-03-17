import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() registerDto: AuthDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() loginDto: AuthDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }
    return this.authService.login(user);
  }
}
