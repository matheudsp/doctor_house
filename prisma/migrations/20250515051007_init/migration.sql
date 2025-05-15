-- DropForeignKey
ALTER TABLE "Mensagem" DROP CONSTRAINT "Mensagem_consulta_id_fkey";

-- AlterTable
ALTER TABLE "Consulta" ADD COLUMN     "evidencias" JSONB,
ADD COLUMN     "exames_adicionais" JSONB;

-- CreateIndex
CREATE INDEX "Consulta_status_idx" ON "Consulta"("status");

-- CreateIndex
CREATE INDEX "Mensagem_consulta_id_idx" ON "Mensagem"("consulta_id");

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "Consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
