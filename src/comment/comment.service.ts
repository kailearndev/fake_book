import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async createComment(userId: string, postId: string, content: string, parentId?: string) {
        return this.prismaService.comment.create({
            data: {
                content,
                postId,
                authorId: userId,
                parentId: parentId || null, // Gán parentId nếu có (để làm reply)
            },
            include: {
                author: { select: { name: true } } // Trả về tên tác giả để hiển thị ngay
            }
        });
    }
    async updateComment(commentId: string, userId: string, content: string) {
        // Kiểm tra xem comment có tồn tại và thuộc về user không
        const existingComment = await this.prismaService.comment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            throw new Error('Comment not found');
        }

        if (existingComment.authorId !== userId) {
            throw new Error('Unauthorized');
        }

        // Cập nhật nội dung comment
        return this.prismaService.comment.update({
            where: { id: commentId },
            data: { content },
        });
    }

    async deleteComment(commentId: string, userId: string) {
        // Kiểm tra xem comment có tồn tại và thuộc về user không
        const existingComment = await this.prismaService.comment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            throw new Error('Comment not found');
        }

        if (existingComment.authorId !== userId) {
            throw new Error('Unauthorized');
        }

        // Xóa comment
        return this.prismaService.comment.delete({
            where: { id: commentId },
        });
    }
}
