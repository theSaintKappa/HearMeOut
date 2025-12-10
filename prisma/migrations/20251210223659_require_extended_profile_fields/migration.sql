/*
  Warnings:

  - Made the column `country` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `followers` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uri` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "followers" SET NOT NULL,
ALTER COLUMN "product" SET NOT NULL,
ALTER COLUMN "uri" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL;
