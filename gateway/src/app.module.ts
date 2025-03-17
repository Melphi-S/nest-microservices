import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.registerAsync(getJwtConfig()),
    ClientsModule.register([
      {
        name: 'AUTH',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_HOST || 'localhost',
          port: parseInt(process.env.AUTH_PORT || '4002'),
        },
      },
      {
        name: 'POSTS',
        transport: Transport.TCP,
        options: {
          host: process.env.POSTS_HOST || 'localhost',
          port: parseInt(process.env.POSTS_PORT || '4001'),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
