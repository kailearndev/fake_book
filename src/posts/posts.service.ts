import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) { }
  async createPost(userId: string, content: string, imageUrls: string[] = []) {
    const post = await this.prismaService.post.create({
      data: {
        content,
        authorId: userId,
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
        author: { select: { email: true } },
      },
    });
    return { message: `Tạo bài viết thành công ${post.images.length} ảnh!` };
  }

  async findAll(userId: string) {
    const posts = await this.prismaService.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        author: {
          select: { id: true, email: true, name: true },
        },
        // Lấy toàn bộ reactions để phân loại
        reactions: {
          select: { type: true, userId: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          where: { parentId: null }, // Chỉ lấy comment gốc trước
          include: {
            author: { select: { name: true } },
            replies: {
              // Lấy các reply của comment đó
              include: {
                author: { select: { name: true } },
              },
            },

          },

        },
      },
    });

    return posts.map((post) => {
      // 1. Phân loại và đếm các loại reaction
      const reactionStats = post.reactions.reduce(
        (acc, curr) => {
          acc[curr.type] = (acc[curr.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // 2. Kiểm tra xem User hiện tại đã thả react chưa và loại gì
      const myReaction = post.reactions.find((r) => r.userId === userId);

      return {
        ...post,
        isMine: post.authorId === userId,
        reactionStats, // Trả về dạng: { "LIKE": 10, "HAHA": 5, "ANGRY": 2 }
        myReactionType: myReaction ? myReaction.type : null, // Frontend dùng để tô màu nút tương ứng
        totalReactions: post.reactions.length,
        // Xóa mảng reactions thô đi cho nhẹ JSON trả về
        reactions: undefined,
      };
    });
  }

  async findOne(id: string) {
    return await this.prismaService.post.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return await this.prismaService.post.update({
      where: { id },
      data: {
        content: updatePostDto.content,
      },
    });
  }

  async remove(userId: string, id: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết!');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này!');
    }

    await this.prismaService.post.delete({
      where: { id },
    });
    return { message: 'Xóa bài viết thành công!' };
  }
}
