-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(1000) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Companyprofile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaperusahaan` VARCHAR(255) NOT NULL,
    `bidangusaha` VARCHAR(255) NOT NULL,
    `alamatperusahaan` VARCHAR(255) NOT NULL,
    `alamatkabupaten` VARCHAR(255) NOT NULL,
    `alamatkecamatan` VARCHAR(255) NOT NULL,
    `emailperusahaan` VARCHAR(255) NOT NULL,
    `teleponperusahaan` VARCHAR(255) NOT NULL,
    `jumlahkaryawan` INTEGER NOT NULL,
    `website` VARCHAR(255) NULL,
    `profilperusahaan` VARCHAR(255) NOT NULL,
    `isactive` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profesipekerjaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Profesipekerjaan_nama_idx`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `alamatkirimlamaran` VARCHAR(255) NULL,
    `lamaronline` BOOLEAN NOT NULL DEFAULT false,
    `lamaroffline` BOOLEAN NOT NULL DEFAULT false,
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
ALTER TABLE `Companyprofile` ADD CONSTRAINT `Companyprofile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profesipekerjaan` ADD CONSTRAINT `Profesipekerjaan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lowonganpekerjaan` ADD CONSTRAINT `Lowonganpekerjaan_perusahaanId_fkey` FOREIGN KEY (`perusahaanId`) REFERENCES `Companyprofile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lowonganpekerjaan` ADD CONSTRAINT `Lowonganpekerjaan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
