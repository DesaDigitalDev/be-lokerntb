const { PrismaClient } = require('@prisma/client');
const CrudImagesService = require('../../Services/CrudImages/CrudImagesService');
const prisma = new PrismaClient();

class AdminController {
    static async getAccCompanyProfile(req, res) {
        try {
            const allCompanyToAcc = await prisma.companyprofile.findMany({
                where: {
                    isactive: false
                },
                orderBy: {
                    id: 'desc'
                }
            })
            if (allCompanyToAcc.length === 0) {
                return res.json([])
            }
            allCompanyToAcc.forEach(profile => {
                profile.alamatkabupaten = JSON.parse(profile.alamatkabupaten)
                profile.alamatkecamatan = JSON.parse(profile.alamatkecamatan)
            });
            return res.status(200).json(allCompanyToAcc);
        } catch (error) {
            return res.status(500).json({ error: true })
        }
    }
    static async accOrDeleteCompany(req, res) {
        try {
            const { id, type } = req.body
            if (/^\d+$/.test(id)) {
                const companyProfile = await prisma.companyprofile.findUnique({
                    where: {
                        id: Number.parseInt(id)
                    }
                })
                if (!companyProfile) {
                    return res.status(404).json({ error: true, message: "Tidak ada data perusahaan yang di temukan", path: 'id' })
                }
                if(type === "setujui"){
                    await prisma.companyprofile.update({where:{id:companyProfile.id},data:{isactive:true}})
                    return res.json({error:false})
                }else if(type==="hapus"){
                    await prisma.companyprofile.delete({
                        where:{
                            id:companyProfile.id
                        }
                    })
                    CrudImagesService.deleteImages(companyProfile.profilperusahaan)
                    return res.json({error:false})
                }else{
                    return res.status(400).json({ error: true, message: "Tidak ada aksi yang di lakukan", path: 'id' })
                }
            } else {
                return res.status(400).json({ error: true, message: "hanya number yang di izinkan untuk id", path: 'id' })
            }
        } catch (error) {
            return res.status(500).json({error:true})
        }
    }
}
module.exports = AdminController