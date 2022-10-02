import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsController } from './controllers/aws/aws.controller';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { AwsService } from './services/aws/aws.service';
import 'winston-daily-rotate-file';

const applyFormat = format.combine(
  format.label({ label: `[ Nestjs-Aws-S3-Upload ]` }),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.colorize(),
  format.printf((info) => {
    let afterMessage = ``;
    if (info.context !== undefined) {
      afterMessage += JSON.stringify(info.context);
    }

    if (info.stack !== undefined) {
      afterMessage += JSON.stringify(info.stack, undefined, 2);
    }

    return ``
      .concat(`${info.timestamp} - ${info.level}: `)
      .concat(`${info.label} `)
      .concat(`${info.message} `)
      .concat(afterMessage);
  }),
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        // options
        transports: [
          new transports.Console({
            format: applyFormat,
          }),
          new transports.DailyRotateFile({
            filename: 'logs/system.log', // log 폴더에 system.log 이름으로 저장
            zippedArchive: true, // 압축여부
            json: true,
            format: applyFormat,
          }),
        ],
      }),
      inject: [],
    }),
  ],
  controllers: [AwsController, AppController],
  providers: [AppService, AwsService],
})
export class AppModule {}
