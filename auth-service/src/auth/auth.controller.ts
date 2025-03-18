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

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() registerDto: AuthDto) {
    try {
      return this.authService.register(registerDto.email, registerDto.password);
    } catch (error) {
      console.error(error);

      if (error instanceof RpcException) {
        throw error;
      }

      if (error instanceof HttpException) {
        throw new RpcException({
          statusCode: error.getStatus(),
          message: error.message,
        });
      }

      throw new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() loginDto: AuthDto) {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      if (!user) {
        throw new UnauthorizedException('Неправильный логин или пароль');
      }
      return this.authService.login(user);
    } catch (error) {
      console.error(error);

      if (error instanceof RpcException) {
        throw error;
      }

      if (error instanceof HttpException) {
        throw new RpcException({
          statusCode: error.getStatus(),
          message: error.message,
        });
      }

      throw new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }
}
