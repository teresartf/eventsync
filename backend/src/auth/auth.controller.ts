// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.senha);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new UnauthorizedException('Email já cadastrado');

    const user = await this.userService.create({
      nome: dto.nome,
      email: dto.email,
      senha: dto.senha,
      role: dto.role,
    });

    return this.authService.login(user); // login automático após cadastro
  }
}