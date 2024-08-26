-- DropIndex
DROP INDEX `Companyprofile_emailperusahaan_key` ON `companyprofile`;

-- AlterTable
ALTER TABLE `companyprofile` MODIFY `emailperusahaan` VARCHAR(255) NOT NULL;
