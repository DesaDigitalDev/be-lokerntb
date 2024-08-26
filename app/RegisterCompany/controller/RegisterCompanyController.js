const { PrismaClient } = require('@prisma/client');
const { perusahaanValidation } = require('../../Services/Validation/JoiValidation');
const removeSpacesServices = require('../../Services/RemoveSpace/RemoveSpaceService');
const ValidationService = require('../../Services/AllValidation/AllValidationService');
const CrudImagesService = require('../../Services/CrudImages/CrudImagesService');
const prisma = new PrismaClient();

class RegisterCompanyController {
    static filterCompanyData(data) {
        const allowedFields = ['namaperusahaan', 'bidangusaha', 'alamatperusahaan', 'alamatkabupaten', 'alamatkecamatan', 'emailperusahaan', 'teleponperusahaan', 'jumlahkaryawan', 'website', 'profilperusahaan', 'filegambar'];
        return Object.keys(data)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});
    }
    static async createCompany(req, res) {
        try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'File gambar harus diunggah',path:'profilperusahaan' });
        }

        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const fileSize = file.size / 1024 / 1024; // ukuran dalam MB
        const fileExtension = file.originalname.match(/\.[0-9a-z]+$/i);

        if (!fileExtension || !validExtensions.includes(fileExtension[0].toLowerCase())) {
            return res.status(400).json({ message: 'Format file tidak didukung. Hanya .jpg, .jpeg, .png, .webp yang diizinkan' ,path:'profilperusahaan'});
        }

        if (fileSize > 2) {
            return res.status(400).json({ message: 'Ukuran file terlalu besar. Maksimal 2MB',path:'profilperusahaan' });
        }
        
        req.body = removeSpacesServices(req.body)
        req.body = RegisterCompanyController.filterCompanyData(req.body)
        const {error} = perusahaanValidation.validate(req.body)
        if(error){
            const pathlain = ['alamatkabupaten','alamatkecamatan']
            const pathdia = error.details[0].path.join('.')
            if(!pathlain.includes(pathdia)){
                return res.status(400).json({
                    message: error.details[0].message,
                    path: pathdia
                  });
            }
        }

        const {teleponperusahaan,jumlahkaryawan,alamatkabupaten,alamatkecamatan} = req.body
        // validasi angka untuk nomor telpon dan jumlah karyawaan
        if(!ValidationService.isOnlyNumbers(teleponperusahaan)){
            return res.status(400).json({message:'Nomor telepon harus angka',path:'teleponperusahaan'})
        }else if(!ValidationService.isOnlyNumbers(jumlahkaryawan)){
            return res.status(400).json({message:'Jumlah karyawan harus angka',path:'jumlahkaryawan'})
        }

        // validasi alamat
        const vlKabupaten = ValidationService.isValidAddress(alamatkabupaten,req.body,"kabupaten")
        if(vlKabupaten.error){
            return res.status(400).json(vlKabupaten)
        }
        const vlKecamatan = ValidationService.isValidAddress(alamatkecamatan,req.body,"kecamatan")
        if(vlKecamatan.error){
            return res.status(400).json(vlKecamatan)
        }

        // simpan images
        CrudImagesService.saveImages(req.file,req.body)
        // ubah object jadi string husus untul alamt kabupaten dan alamat kecamanta
        req.body.alamatkabupaten = JSON.stringify(req.body.alamatkabupaten)
        req.body.alamatkecamatan = JSON.stringify(req.body.alamatkecamatan)
        // Proses lanjutan untuk menyimpan data perusahaan beserta file gambar
        req.body.jumlahkaryawan = Number.parseInt(req.body.jumlahkaryawan)
        req.body.userId = req.user.id
        await prisma.companyprofile.create({data:req.body})
        return res.json({message:'Berhasil membuat perusahaan baru'})
        } catch (error) {
            res.status(500).json({ message: 'Gagal membuat perusahaan baru', error: error.message });
        }
    }
    static async getCompanyProfile(req,res){
        try {
            const companyProfile = await prisma.companyprofile.findMany({
                where:{
                    userId:req.user.id
                }
            })
            if(companyProfile.length === 0){
                return res.json([])
            }
            companyProfile.forEach(profile => {
                profile.alamatkabupaten=JSON.parse(profile.alamatkabupaten)
                profile.alamatkecamatan=JSON.parse(profile.alamatkecamatan)
            });
            return res.status(200).json(companyProfile);
        } catch (error) {
            res.status(500).json([]);
        }
    }
    static async updateCompanyProfile(req,res){
        try {
            
            const idcompany = req.query.idcompany
            if(!idcompany){
                return res.status(401).json({message:'Tidak punya akses ke sini'})
            }

            const cekCompany = await prisma.companyprofile.findUnique({
                where:{
                    id:Number.parseInt(idcompany),
                    userId:req.user.id
                }
            })

            if(!cekCompany){
                return res.status(401).json({message:'Tidak punya akses ke sini'})
            }
            const file = req.file;
            if(file){
                const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
                const fileSize = file.size / 1024 / 1024; // ukuran dalam MB
                const fileExtension = file.originalname.match(/\.[0-9a-z]+$/i);

                if (!fileExtension || !validExtensions.includes(fileExtension[0].toLowerCase())) {
                    return res.status(400).json({ message: 'Format file tidak didukung. Hanya .jpg, .jpeg, .png, .webp yang diizinkan' ,path:'profilperusahaan'});
                }

                if (fileSize > 2) {
                    return res.status(400).json({ message: 'Ukuran file terlalu besar. Maksimal 2MB',path:'profilperusahaan' });
                }
            }

            req.body = removeSpacesServices(req.body)
            req.body = RegisterCompanyController.filterCompanyData(req.body)
            const {error} = perusahaanValidation.validate(req.body)
            if(error){
                const pathlain = ['alamatkabupaten','alamatkecamatan']
                const pathdia = error.details[0].path.join('.')
                if(!pathlain.includes(pathdia)){
                    return res.status(400).json({
                        message: error.details[0].message,
                        path: pathdia
                    });
                }
            }

            
            const {teleponperusahaan,jumlahkaryawan,alamatkabupaten,alamatkecamatan} = req.body
            // validasi angka untuk nomor telpon dan jumlah karyawaan
            if(!ValidationService.isOnlyNumbers(teleponperusahaan)){
                return res.status(400).json({message:'Nomor telepon harus angka',path:'teleponperusahaan'})
            }else if(!ValidationService.isOnlyNumbers(jumlahkaryawan)){
                return res.status(400).json({message:'Jumlah karyawan harus angka',path:'jumlahkaryawan'})
            }

            // validasi alamat
            const vlKabupaten = ValidationService.isValidAddress(alamatkabupaten,req.body,"kabupaten")
            if(vlKabupaten.error){
                return res.status(400).json(vlKabupaten)
            }
            const vlKecamatan = ValidationService.isValidAddress(alamatkecamatan,req.body,"kecamatan")
            if(vlKecamatan.error){
                return res.status(400).json(vlKecamatan)
            }

            // simpan images
            if(req.file){
                const deletepoto = cekCompany.profilperusahaan
                CrudImagesService.saveImages(req.file,req.body,'public/images/profilperusahaan',true,deletepoto)
            }
            // ubah object jadi string husus untul alamt kabupaten dan alamat kecamanta
            req.body.alamatkabupaten = JSON.stringify(req.body.alamatkabupaten)
            req.body.alamatkecamatan = JSON.stringify(req.body.alamatkecamatan)
            // Proses lanjutan untuk menyimpan data perusahaan beserta file gambar
            req.body.jumlahkaryawan = Number.parseInt(req.body.jumlahkaryawan)
            req.body.userId = req.user.id
            await prisma.companyprofile.update({
                where:{id:cekCompany.id},
                data:req.body
            })
            return res.json({message:'Berhasil memperbarui profil perusahaan'})
        } catch (error) {
            res.status(500).json({ message: 'Gagal memperbarui profil perusahaan perusahaan', error: error.message });
        }
    }
    static async deleteCompanyProfile(req,res){
        try {
            const { idperusahaan } = req.params;
            if (!/^\d+$/.test(idperusahaan)) {
                return res.status(400).json({error:true,message:'gagal menghapus perusahaan',path:'perusahaan'})
            }
            const dataperusahaan = await prisma.companyprofile.findUnique({
                where:{
                    id:Number.parseInt(idperusahaan),
                    userId:req.user.id
                }
            })
            if(!dataperusahaan){
                return res.status(400).json({error:true,message:'perusahaan tidak ditemukan',path:'perusahaan'})
            }
            // hapus perusahaan, lowongan perusahaan dan poto profil perusahaan
            const allaction = []
            allaction.push(
                prisma.companyprofile.delete({where:{id:dataperusahaan.id}}),
                prisma.lowonganpekerjaan.deleteMany({where:{perusahaanId:dataperusahaan.id}})
            )            
            // hapus gambar
            CrudImagesService.deleteImages(dataperusahaan.profilperusahaan)
            await Promise.all(allaction)
            return res.json({oke:'oke'})
        } catch (error) {
            return res.status(500).json({error:true})
        }
    }
}

module.exports = RegisterCompanyController;

