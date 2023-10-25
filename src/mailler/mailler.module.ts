import { Global, Module } from '@nestjs/common';
import { MaillerService } from './mailler.service';

@Global()
@Module({
  providers: [MaillerService],
  exports :[MaillerService]
})
export class MaillerModule {}
