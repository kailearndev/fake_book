import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReactionService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }
    async reactToPost(userId: string, postId: string, type: string) {
        // Kiểm tra xem người dùng đã phản ứng với bài viết này chưa
        const existingReaction = await this.prismaService.reaction.findFirst({
            where: {
                userId,
                postId,
            },
        });
        if (existingReaction) {
            // Nếu đã phản ứng, cập nhật loại phản ứng
            if (existingReaction.type === type) {
                // Nếu loại phản ứng giống nhau, xóa phản ứng (tức là bỏ thích hoặc bỏ không thích)
                await this.prismaService.reaction.delete({
                    where: { id: existingReaction.id },
                });
                return { action: 'UNLIKE', message: 'Đã bỏ bày tỏ cảm xúc' };
            }
            const updated = await this.prismaService.reaction.update({
                where: { id: existingReaction.id },
                data: { type },
            });
            return { action: 'UPDATE', data: updated };
        }
        const newReaction = await this.prismaService.reaction.create({
            data: { userId, postId, type },
        });
        return { action: 'LIKE', data: newReaction };
    }
}
