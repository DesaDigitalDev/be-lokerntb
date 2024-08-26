const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ProfesiPekerjaanController {
    static minimalpendidikan = [
        { nama: 'SD - SMP' },
        { nama: 'SMA / SMK' },
        { nama: 'D1 - D3' },
        { nama: 'S1 / D4' },
        { nama: 'S2 / PROFESI' },
    ];
    static jenisKelamin = [
        { nama: 'Pria' },
        { nama: 'Wanita' },
        // { nama: 'Pria & Wanita' },
    ];
    static statusKerja = [
        { nama: 'Full Time' },
        { nama: 'Part Time' },
        { nama: 'Freelance' },
        { nama: 'Magang' },
    ];
    static async attributeLowonganPekerjaan(req,res){
        const datareturn ={
            profesipekerjaan:[],
            jeniskelamin:ProfesiPekerjaanController.jenisKelamin.sort((a, b) => a.nama.localeCompare(b.nama)),
            statuskerja:ProfesiPekerjaanController.statusKerja.sort((a, b) => a.nama.localeCompare(b.nama)),
            pendidikan : ProfesiPekerjaanController.minimalpendidikan
        }
        try {
            const profesipekerjaan = await prisma.profesipekerjaan.findMany();
            datareturn.profesipekerjaan = profesipekerjaan.sort((a, b) => a.nama.localeCompare(b.nama));
            return res.json(datareturn);
        } catch (error) {
            console.log(error)
            return res.status(500).json(datareturn)
        }
    }
}
module.exports = ProfesiPekerjaanController;
