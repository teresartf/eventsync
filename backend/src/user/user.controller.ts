/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Post, Put, Delete, Param, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpsertUserDto } from './dto/upsert-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      return await this.userService.create(dto);
    } catch (err: any) {
      // Retorna erro amigável
      return { message: err.message };
    }
  }
  
  // Atualizar usuário
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  // Upsert (cria se não existe ou atualiza se existe)
  @Post('upsert')
  upsert(@Body() dto: UpsertUserDto) {
    return this.userService.upsert(dto);
  }

  // Deletar usuário
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  // Buscar usuário por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // Listar todos os usuários
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // GET /usuarios/perfil -> perfil logado
  @Get('perfil')
  obterPerfil(@Req() req: any) {
    return this.userService.obterPerfil(req.userId);
  }

  // GET /usuarios/:id -> perfil público
  @Get(':id')
  obterPerfilPublico(@Req() req: any, @Param('id') id: string) {
    return this.userService.obterPerfilPublico(id);
  }
}
