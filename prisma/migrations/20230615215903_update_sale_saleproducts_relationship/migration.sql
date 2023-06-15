-- DropIndex
DROP INDEX "SaleProducts_saleId_key";

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "saleProductsId" INTEGER;
