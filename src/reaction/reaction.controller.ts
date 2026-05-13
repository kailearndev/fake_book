// src/reactions/reactions.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReactionService } from './reaction.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreateReactionDto } from './dto/reaction.dto';

@Controller('reactions')
export class ReactionController {
    constructor(private readonly reactionsService: ReactionService) { }
    @UseGuards(AuthGuard)

    @ApiBearerAuth()
    @ApiBody({ type: CreateReactionDto }) // <-- Đảm bảo bạn đã tạo DTO này
    @Post('toggle')
    async toggle(
        @Body('postId') postId: string,
        @Body('type') type: string, // VD: 'LIKE'
        @Req() req: any,
    ) {
        const userId = req.user.sub; // ID từ Token
        return this.reactionsService.reactToPost(userId, postId, type);
    }
}