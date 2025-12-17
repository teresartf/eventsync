import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CriarMensagemDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do destinatário é obrigatório.' })
  destinatarioId!: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo da mensagem é obrigatório.' })
  conteudo!: string;

  @IsOptional()
  @IsString()
  anexoUrl?: string; // ⚠️ nome alterado para bater com o model
}
