/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertUserDto } from './dto/upsert-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  
  async create(dto: CreateUserDto) {
    // Verifica se o email já existe
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
  
    if (existe) {
      throw new Error('Email já cadastrado');
    }
  
    const senhaHash = await bcrypt.hash(dto.senha, 10);
  
    return this.prisma.usuario.create({
      data: {
        id: randomUUID(),
        nome: dto.nome,
        email: dto.email,
        senhaHash,
        cidade: dto.cidade,
        fotoUrl: dto.fotoUrl,
        role: dto.role,
        visibilidadeParticipacao: true,
        ratingOrganizador: 0,
      },
    });
  }
  
  

  // Upsert: atualiza se existe, cria se não existe
  async upsert(dto: UpsertUserDto) {
    return this.prisma.usuario.upsert({
      where: { id: dto.id },
      update: {
        nome: dto.nome,
        email: dto.email,
        senhaHash: dto.senhaHash,
        cidade: dto.cidade,
        fotoUrl: dto.fotoUrl,
        role: dto.role,
        visibilidadeParticipacao: dto.visibilidadeParticipacao,
        ratingOrganizador: dto.ratingOrganizador,
      },
      create: {
        id: dto.id,
        nome: dto.nome,
        email: dto.email,
        senhaHash: dto.senhaHash,
        cidade: dto.cidade,
        fotoUrl: dto.fotoUrl,
        role: dto.role,
        visibilidadeParticipacao: dto.visibilidadeParticipacao,
        ratingOrganizador: dto.ratingOrganizador,
      },
    });
  }

  // Pegar perfil do usuário logado
  async obterPerfil(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nome: true,
        email: true,
        cidade: true,
        fotoUrl: true,
        visibilidadeParticipacao: true,
        ratingOrganizador: true,
        role: true,
        createdAt: true,

      },
    });
    if (!usuario) throw new Error('Usuário não encontrado');
    return usuario;
  }

  // Pegar perfil público de outro usuário
  async obterPerfilPublico(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nome: true,
        cidade: true,
        fotoUrl: true,
        ratingOrganizador: true,
        visibilidadeParticipacao: true,
      },
    });

    if (!usuario) throw new Error('Usuário não encontrado');
    if (!usuario.visibilidadeParticipacao) throw new Error('Perfil privado');

    return usuario;
  }


  // Atualizar usuário
  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.usuario.update({
      where: { id },
      data: {
        nome: dto.nome,
        email: dto.email,
        senhaHash: dto.senhaHash,
        cidade: dto.cidade,
        fotoUrl: dto.fotoUrl,
        role: dto.role,
        visibilidadeParticipacao: dto.visibilidadeParticipacao,
        ratingOrganizador: dto.ratingOrganizador,
      },
    });
  }

  // Deletar usuário
  async delete(id: string) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }

  // Buscar usuário por id
  async findOne(id: string) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  // Listar todos usuários
  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

}