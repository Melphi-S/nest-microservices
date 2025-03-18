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
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: [process.env.KAFKA_BROKER || `localhost:9092`],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
      {
        name: 'POSTS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'posts',
            brokers: [process.env.KAFKA_BROKER || `localhost:9092`],
          },
          consumer: {
            groupId: 'posts-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
