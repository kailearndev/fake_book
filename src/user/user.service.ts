import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({ where: { email: createUserDto.email } });
    if (existingUser) throw new BadRequestException('Email này đã được đăng ký!');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        roles: ['user'],
        status: UserStatus.PENDING
      },
    });
    return { message: 'Đăng ký thành công!', userId: user.id };
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        status: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        status: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.user.update({
      where: { id },
      data: { status: UserStatus.BLOCKED },
    });
  }


}
