-- CreateTable
CREATE TABLE "ChannelPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "channelId" INTEGER NOT NULL,
    "gymRoleId" INTEGER NOT NULL,
    CONSTRAINT "ChannelPost_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChannelPost_gymRoleId_fkey" FOREIGN KEY ("gymRoleId") REFERENCES "GymRole" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);