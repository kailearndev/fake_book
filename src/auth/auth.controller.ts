import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/decorators/roles.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('USER')
    @ApiBearerAuth()
    @Patch('profile')
    updateInfo(
        @Req() req,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.authService.userUpdateInfo(
            req.user.sub,
            updateUserDto,
        )
    }
}
