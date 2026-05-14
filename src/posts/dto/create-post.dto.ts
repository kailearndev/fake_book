import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'Hôm nay trời đẹp quá!',
    description: 'Nội dung bài viết',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string' },
    example: ['https://s3.cloudfly.vn/bucket/fakebook/image.jpg'],
    description: 'Danh sách URL ảnh đã upload',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
