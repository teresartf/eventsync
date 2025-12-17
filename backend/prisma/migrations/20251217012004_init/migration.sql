-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ORGANIZER');

-- CreateEnum
CREATE TYPE "EventoTipo" AS ENUM ('GRATUITO', 'PAGO');

-- CreateEnum
CREATE TYPE "EventoStatus" AS ENUM ('RASCUNHO', 'PUBLICADO', 'CANCELADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "InscricaoStatus" AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA', 'CHECKED_IN');

-- CreateEnum
CREATE TYPE "MetodoCheckin" AS ENUM ('MANUAL', 'QR');

-- CreateEnum
CREATE TYPE "StatusAmizade" AS ENUM ('PENDENTE', 'ACEITA', 'BLOQUEADA');

-- CreateEnum
CREATE TYPE "TipoMensagem" AS ENUM ('TEXTO', 'IMAGEM', 'ARQUIVO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "cidade" TEXT,
    "fotoUrl" TEXT,
    "visibilidadeParticipacao" BOOLEAN NOT NULL DEFAULT true,
    "ratingOrganizador" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "organizadorId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "localEndereco" TEXT,
    "localUrl" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "preco" DOUBLE PRECISION,
    "tipo" "EventoTipo" NOT NULL,
    "exigeAprovacao" BOOLEAN NOT NULL DEFAULT false,
    "inscricaoAbre" TIMESTAMP(3) NOT NULL,
    "inscricaoFecha" TIMESTAMP(3) NOT NULL,
    "maxInscricoes" INTEGER,
    "nCheckinsPermitidos" INTEGER NOT NULL DEFAULT 1,
    "status" "EventoStatus" NOT NULL,
    "bannerUrl" TEXT,
    "cargaHoraria" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscricao" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "status" "InscricaoStatus" NOT NULL,
    "timestampInscricao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timestampPagamento" TIMESTAMP(3),
    "nCheckinsRealizados" INTEGER NOT NULL DEFAULT 0,
    "certificadoEmitido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckinRegistro" (
    "id" TEXT NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodo" "MetodoCheckin" NOT NULL,

    CONSTRAINT "CheckinRegistro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amizade" (
    "id" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "destinatarioId" TEXT NOT NULL,
    "status" "StatusAmizade" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amizade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensagem" (
    "id" TEXT NOT NULL,
    "remetenteId" TEXT NOT NULL,
    "destinatarioId" TEXT NOT NULL,
    "tipo" "TipoMensagem" NOT NULL,
    "conteudo" TEXT,
    "anexoUrl" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificado" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "urlPdf" TEXT NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoValidacao" TEXT NOT NULL,

    CONSTRAINT "Certificado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_eventoId_usuarioId_key" ON "Inscricao"("eventoId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Amizade_solicitanteId_destinatarioId_key" ON "Amizade"("solicitanteId", "destinatarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_eventoId_usuarioId_key" ON "Avaliacao"("eventoId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificado_codigoValidacao_key" ON "Certificado"("codigoValidacao");

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinRegistro" ADD CONSTRAINT "CheckinRegistro_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "Inscricao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amizade" ADD CONSTRAINT "Amizade_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amizade" ADD CONSTRAINT "Amizade_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_remetenteId_fkey" FOREIGN KEY ("remetenteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
