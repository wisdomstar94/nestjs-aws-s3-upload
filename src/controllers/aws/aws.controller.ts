import {
  Controller,
  Inject,
  LoggerService,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AwsService } from 'src/services/aws/aws.service';

@Controller('api/aws')
export class AwsController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly awsService: AwsService,
  ) {}

  @Post('/s3')
  @UseInterceptors(FileInterceptor('file'))
  async s3Upload(@UploadedFile() file: Express.Multer.File) {
    /*
      {
        fieldname: 'file',
        originalname: 'sample.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 04 b0 00 00 04 b0 08 06 00 00 00 eb 21 b3 cf 00 00 00 09 70 48 59 73 00 00 0b 13 00 00 0b 13 01 ... 47404 more bytes>,
        size: 47454
      }
    */
    await this.awsService.s3Upload(file);
    return 'Success!';
  }
}
