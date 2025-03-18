import {
  Controller,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(@Payload() registerDto: AuthDto) {
    try {
      return this.authService.register(registerDto.email, registerDto.password);
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw new RpcException({
          statusCode: error.getStatus(),
          message: error.message,
        });
      } else {
        throw new RpcException({
          statusCode: 500,
          message: 'Internal server error',
        });
      }
    }
  }

  @MessagePattern('login')
  async login(@Payload() loginDto: AuthDto) {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      if (!user) {
        throw new UnauthorizedException('Неправильный логин или пароль');
      }
      const token = await this.authService.login(user);
      return token;
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw new RpcException({
          statusCode: error.getStatus(),
          message: error.message,
        });
      } else {
        throw new RpcException({
          statusCode: 500,
          message: 'Internal server error',
        });
      }
    }
  }
}
