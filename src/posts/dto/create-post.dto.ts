import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({ example: 'Hôm nay trời đẹp quá!', description: 'Nội dung bài viết' })
    content: string;

    @ApiProperty({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Danh sách ảnh (tối đa 10 ảnh)',
    })
    images: any[];
}