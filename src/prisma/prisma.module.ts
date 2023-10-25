import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PostService } from 'src/post/post.service';

@Global()
@Module({
  providers: [PrismaService, PostService],
  exports:[PrismaService]
})
export class PrismaModule {}
