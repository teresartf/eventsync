import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string) {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(senha, user.senhaHash)) {
      const { senhaHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: { nome: string; email: string; senha: string; role: 'USER' }) {
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) throw new Error('Email já cadastrado');
  
    const senhaHash = await bcrypt.hash(data.senha, 10);
  
    const user = await this.userService.create({
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      role: data.role,
    });
  
    const { senhaHash: _, ...result } = user;
    return result;
  }
  
}
