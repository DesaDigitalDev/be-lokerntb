-- CreateTable
CREATE TABLE `Lowonganpekerjaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `perusahaanId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `gaji` VARCHAR(255) NOT NULL,
    `umur` VARCHAR(255) NOT NULL,
    `kabupaten` VARCHAR(255) NOT NULL,
    `kecamatan` VARCHAR(255) NOT NULL,
    `lokasi` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `nomorhp` VARCHAR(255) NULL,
    `profesipekerjaan` TEXT NOT NULL,
    `jeniskelamin` TEXT NOT NULL,
    `statuskerja` TEXT NOT NULL,
    `pendidikan` TEXT NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lowonganpekerjaan` ADD CONSTRAINT `Lowonganpekerjaan_perusahaanId_fkey` FOREIGN KEY (`perusahaanId`) REFERENCES `Companyprofile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lowonganpekerjaan` ADD CONSTRAINT `Lowonganpekerjaan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
