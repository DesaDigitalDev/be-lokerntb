-- AlterTable
ALTER TABLE `lowonganpekerjaan` ADD COLUMN `alamatkirimlamaran` VARCHAR(255) NULL,
    ADD COLUMN `lamaroffline` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lamaronline` BOOLEAN NOT NULL DEFAULT false;
