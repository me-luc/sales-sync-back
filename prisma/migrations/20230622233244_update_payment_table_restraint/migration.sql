/*
  Warnings:

  - You are about to drop the column `stripeId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stripeId";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeId_key" ON "Payment"("stripeId");
