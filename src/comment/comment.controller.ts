import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
@UseGuards(AuthGuard)
@ApiTags('comments')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentsService: CommentService) { }

    @Post()
    @ApiBearerAuth()
    @ApiBody({ schema: { example: { postId: 'post123', content: 'Nội dung comment', parentId: 'comment456 (nếu là reply)' } } })
    postComment(
        @Body('postId') postId: string,
        @Body('content') content: string,
        @Body('parentId') parentId: string, // Có thể có hoặc không
        @Req() req: any,
    ) {
        const userId = req.user.sub;
        return this.commentsService.createComment(userId, postId, content, parentId);
    }
    @UseGuards(AuthGuard)
    @Post(':commentId')
    @ApiBearerAuth()
    @ApiBody({ schema: { example: { content: 'Nội dung comment được cập nhật' } } })
    async updateComment(
        @Body('content') content: string,
        @Req() req: any,
        @Param('commentId') commentId: string
    ) {
        const userId = req.user.sub;
        return this.commentsService.updateComment(commentId, userId, content);
    }
    @UseGuards(AuthGuard)
    @Delete(':commentId')
    @ApiBearerAuth()
    async deleteComment(
        @Req() req: any,
        @Param('commentId') commentId: string
    ) {
        const userId = req.user.sub;
        return this.commentsService.deleteComment(commentId, userId);
    }

}
