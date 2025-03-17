import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await compare(password, user.password))) {
      return user;
    }
    return null;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string): Promise<User> {
    const oldUser = await this.userRepository.findOne({ where: { email } });

    if (oldUser) {
      throw new BadRequestException(
        'Пользователь с данный email уже зарегистрирован',
      );
    }

    const hashedPassword = await hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }
}
