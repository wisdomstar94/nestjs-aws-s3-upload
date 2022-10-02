import { Inject, Injectable, LoggerService } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import 'dotenv/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  region: process.env.AWS_REGION,
  /*

    accessKeyId 와 secretAccessKey 옵션은 deprecated 되었으며,
    .env 환경변수 파일에 "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY" 가 정의되어 있으면
    AWS SDK 에서 자동으로 읽어들여 자격증명을 시도한다고 합니다.

    참조) https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
  */
});

@Injectable()
export class AwsService {
  s3 = new AWS.S3();

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async s3Upload(file: Express.Multer.File) {
    try {
      const response = await this.s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME + '',
          Key: uuidv4() + '_' + file.originalname,
          Body: file.buffer,
        })
        .promise();
      return response;
    } catch (e) {
      this.logger.error('error', e);
      throw new Error('AWS S3 파일 업로드에 실패하였습니다.');
    }
  }
}
