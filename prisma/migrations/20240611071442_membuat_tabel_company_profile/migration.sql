-- CreateTable
CREATE TABLE `Companyprofile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaperusahaan` VARCHAR(255) NOT NULL,
    `bidangusaha` VARCHAR(255) NOT NULL,
    `alamatperusahaan` VARCHAR(255) NOT NULL,
    `alamatkabupaten` VARCHAR(255) NOT NULL,
    `alamatkecamatan` VARCHAR(255) NOT NULL,
    `emailperusahaan` VARCHAR(191) NOT NULL,
    `teleponperusahaan` VARCHAR(255) NOT NULL,
    `jumlahkaryawan` INTEGER NOT NULL,
    `website` VARCHAR(255) NULL,
    `profilperusahaan` VARCHAR(255) NOT NULL,
    `isactive` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Companyprofile_emailperusahaan_key`(`emailperusahaan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Companyprofile` ADD CONSTRAINT `Companyprofile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
