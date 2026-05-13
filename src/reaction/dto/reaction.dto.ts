import { ApiProperty } from "@nestjs/swagger";

export class CreateReactionDto {
    @ApiProperty({ description: 'ID của bài viết mà người dùng muốn phản ứng' })
    postId: string;
    @ApiProperty({ description: 'Loại phản ứng, ví dụ: LIKE, LOVE, HAHA, WOW, SAD, ANGRY' })
    type: string; // VD: 'LIKE'
}