-- CreateTable
CREATE TABLE "ShareEvent" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShareEvent_postId_platform_idx" ON "ShareEvent"("postId", "platform");

-- AddForeignKey
ALTER TABLE "ShareEvent" ADD CONSTRAINT "ShareEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
