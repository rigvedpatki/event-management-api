import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDummy } from './app-dummy';
import { AppController } from './app.controller';
import { AppJapanService } from './app.japan.service';
import { AppService } from './app.service';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd
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
