-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "newPrice" DOUBLE PRECISION,
    "reviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Discount_reviewId_key" ON "Discount"("reviewId");

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
