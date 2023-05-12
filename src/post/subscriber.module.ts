import { SubscriberController } from './subscriber.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport, Client } from '@nestjs/microservices';
@Module({
  imports: [ConfigModule],
  controllers: [SubscriberController],
  providers: [
    {
      provide: 'SUBSCRIBER_SERVICE',
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: 4000,
          },
        }),
      inject: [ConfigService],
    },
  ],
})
export class SubscriberModule {}
