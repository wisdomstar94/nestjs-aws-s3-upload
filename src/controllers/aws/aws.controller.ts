import { Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('api/aws')
export class AwsController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post('/s3')
  s3Upload(): string {
    this.logger.log('message', { a: 'zzz' });
    this.logger.error('message', { a: 'zzz' });
    this.logger.warn('message', { a: 'zzz' });
    return 'This action returns all cats';
  }
}
