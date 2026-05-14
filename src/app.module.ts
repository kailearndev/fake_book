import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ReactionService } from './reaction/reaction.service';
import { ReactionController } from './reaction/reaction.controller';
import { CommentService } from './comment/comment.service';
import { CommentController } from './comment/comment.controller';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PostsModule,
    JwtModule,
    UploadModule,
  ],
  controllers: [AppController, ReactionController, CommentController],
  providers: [AppService, ReactionService, CommentService],
})
export class AppModule {}
