import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
// import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.prismaService.user.findUnique({ where: { email: registerDto.email } });
        if (existingUser) throw new BadRequestException('Email này đã được đăng ký!');
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prismaService.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                name: registerDto.name,
            },
        });
        return { message: 'Đăng ký thành công!', userId: user.id };
    }
    async login(loginDto: LoginDto) {
        const user = await this.prismaService.user.findUnique({ where: { email: loginDto.email } });
        if (!user) throw new BadRequestException('Email hoặc mật khẩu không đúng!');
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Email hoặc mật khẩu không đúng!');
        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);
        return { message: 'Đăng nhập thành công!', token };
    }
}
