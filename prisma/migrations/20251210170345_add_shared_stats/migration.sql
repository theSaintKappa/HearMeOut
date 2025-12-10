-- AlterTable
ALTER TABLE "user" ADD COLUMN     "country" TEXT,
ADD COLUMN     "followers" INTEGER,
ADD COLUMN     "product" TEXT,
ADD COLUMN     "uri" TEXT,
ADD COLUMN     "url" TEXT;

-- CreateTable
CREATE TABLE "shared_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tracksShortTerm" JSONB NOT NULL,
    "tracksMediumTerm" JSONB NOT NULL,
    "tracksLongTerm" JSONB NOT NULL,
    "artistsShortTerm" JSONB NOT NULL,
    "artistsMediumTerm" JSONB NOT NULL,
    "artistsLongTerm" JSONB NOT NULL,

    CONSTRAINT "shared_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shared_stats_userId_key" ON "shared_stats"("userId");

-- CreateIndex
CREATE INDEX "shared_stats_userId_idx" ON "shared_stats"("userId");

-- AddForeignKey
ALTER TABLE "shared_stats" ADD CONSTRAINT "shared_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
