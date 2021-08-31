import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDummy } from './app-dummy';
import { AppController } from './app.controller';
import { AppJapanService } from './app.japan.service';
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
  providers: [
    { provide: AppService, useClass: AppJapanService },
    { provide: 'APP_NAME', useValue: 'Nest Event Backend !' },
    { provide: 'MESSAGE', useFactory: (app) => `${app.getDummy()} Factory`, inject: [AppDummy] },
    AppDummy
  ],
})
export class AppModule { }
