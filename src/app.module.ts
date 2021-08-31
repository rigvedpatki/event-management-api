import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password123',
      database: 'nest-events',
      entities: [Event],
      synchronize: true
    }),
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
