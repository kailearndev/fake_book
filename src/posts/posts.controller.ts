import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express'; // <-- Import dòng này
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import 'multer';
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @ApiConsumes('multipart/form-data') // Bắt buộc để gợi ý form-data
  @ApiBody({ type: CreatePostDto })    // Chỉ định DTO làm mẫu form
  @UseInterceptors(FilesInterceptor('images', 10))
  async createPostWithImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createPostDto: CreatePostDto,
    @Req() req: any
  ) {
    const userId = req.user.sub;
    return this.postsService.createPost(userId, createPostDto.content, files);
  }


  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.postsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }


  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.postsService.remove(userId, id);
  }

}
