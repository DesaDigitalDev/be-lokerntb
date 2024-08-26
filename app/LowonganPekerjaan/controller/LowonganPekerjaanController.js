const ProfesiPekerjaanController = require("../../ProfesiPekerjaan/controller/ProfesiPekerjaanController")
const ValidationService = require("../../Services/AllValidation/AllValidationService")
const removeSpacesServices = require("../../Services/RemoveSpace/RemoveSpaceService")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
class LowonganPekerjaanController {
    static messageerror = {
        error: true,
        message: 'error',
        path: 'profesipekerjaan'
    }


    // perbaiki data untuk di simpan
    static remainingDataToSave(data) {
        // semua key yang boleh masuk 
        // [
        //     'perusahaan', 'gaji',
        //     'umur',       'kabupaten',
        //     'kecamatan',  'lokasi',
        //     'email',      'nomorhp',
        //     'dropdown',   'deskripsi'
        // ]
        function getValue(data) {
            const nilai = []
            data.map(dt => !nilai.includes(dt.nama.toLocaleLowerCase()) ? nilai.push(dt.nama.toLocaleLowerCase()) : null)
            return nilai
        }
        const { profesipekerjaan, jeniskelamin, statuskerja, pendidikan } = data.dropdown
        data.perusahaan = data.perusahaan.id
        data.kabupaten = JSON.stringify(data.kabupaten)
        data.kecamatan = JSON.stringify(data.kecamatan)
        data.profesipekerjaan = getValue(profesipekerjaan)
        data.jeniskelamin = getValue(jeniskelamin)
        data.statuskerja = getValue(statuskerja)
        data.pendidikan = getValue(pendidikan)
        delete data.dropdown
        return data
    }
    // perbaiki data untuk di simpan

    // validasi input
    static validasiInput(data) {
        const errorreturn = { error: false, message: '', path: data.path }
        if (!data) {
            errorreturn.error = true
            errorreturn.message = `${data.path} tidak boleh kosong`
            return errorreturn
        }
        if (data.data.length < 2 || data.data.length > 100) {
            errorreturn.error = true
            errorreturn.message = `${data.path} minimal 2 - 100 karakter`
            return errorreturn
        } else {
            return errorreturn
        }
    }

    // method profesi pekerjaan
    static async validasiProfesiPekerjaan(data) {
        const errorreturn = { error: false, message: '', path: data.path }
        if (!data.data) {
            errorreturn.error = true
            errorreturn.message = `${data.path} tidak boleh kosong`
        } else {
            const dataprofesi = data.data
            if (!dataprofesi.length) {
                errorreturn.error = true
                errorreturn.message = `${data.path} tidak boleh kosong`
            } else {
                const apakaherror = { error: false, message: '', path: data.path }
                dataprofesi.map((dt, index) => {
                    if (!apakaherror.error) {
                        if (!dt.nama) {
                            errorreturn.error = true
                            errorreturn.message = `${data.path} nomor ${index + 1} tidak boleh kosong`
                        } else {
                            const dtdua = removeSpacesServices(dt)
                            if (dtdua.nama.length < 2 || dtdua.nama.length > 50) {
                                errorreturn.error = true
                                errorreturn.message = `profesi pekerjaan nomor ${index + 1} minimal 2 - 50 karakter`
                            }
                        }
                    }
                })
            }
        }
        return errorreturn
    }
    // method profesi pekerjaan

    // validasi perusahaan
    static async validasiPerusahaan(data, req) {
        const errorreturn = { error: false, message: '', path: data.path }
        const dataperusahaan = data.perusahaan
        if (!dataperusahaan || !dataperusahaan?.id) {
            errorreturn.error = true
            errorreturn.message = `${data.path} tidak boleh kosong`
        } else {
            const cariperusahaan = await prisma.companyprofile.findUnique({
                where: {
                    id: dataperusahaan?.id,
                    userId: req.user?.id,
                    isactive: true
                }
            })
            if (!cariperusahaan) {
                errorreturn.error = true
                errorreturn.message = `perusahaan tidak ada`
            } else {
                req = cariperusahaan.id
            }

        }
        return errorreturn
    }
    // validasi perusahaan
    static validasiJenisKelaminStatusKerjaMinimalPendidikan(data) {
        const errorreturn = { error: false, message: '', path: data.path }

        const melakukanaksi = (datamelakukan, message, semuadataacc) => {
            if (!datamelakukan) {
                errorreturn.error = true
                errorreturn.message = message
            } else {
                if (!datamelakukan.length) {
                    errorreturn.error = true
                    errorreturn.message = message
                } else {
                    datamelakukan.map(dt => {
                        if (!errorreturn.error) {
                            if (!semuadataacc.includes(dt.nama.toLocaleLowerCase())) {
                                errorreturn.error = true
                                errorreturn.message = message
                            }
                        }
                    })
                }
            }
        }
        if (data.path === "jeniskelamin") {
            melakukanaksi(data.data[data.path], "jenis kelamin tidak boleh kosong", ProfesiPekerjaanController.jenisKelamin.map(dt => dt.nama.toLocaleLowerCase()))
        } else if (data.path === "statuskerja") {
            melakukanaksi(data.data[data.path], "status kerja tidak boleh kosong", ProfesiPekerjaanController.statusKerja.map(dt => dt.nama.toLocaleLowerCase()))
        } else if (data.path === "pendidikan") {
            melakukanaksi(data.data[data.path], "pendidikan tidak boleh kosong", ProfesiPekerjaanController.minimalpendidikan.map(dt => dt.nama.toLocaleLowerCase()))
        }
        return errorreturn
    }

    // return loker perbaiki data yang sudah di modifikasi
    static replaceLokerToRealData(data) {
        function arrayToObject(dataarray) {
            const alldata = []
            // console.log(dataarray)
            JSON.parse(dataarray).map(datadalam => alldata.push({ nama: datadalam }))
            return alldata
        }
        const loker = []
        if (data && data.length) {
            data.map(dataloker => {
                // data loker
                dataloker.kabupaten = JSON.parse(dataloker.kabupaten)
                dataloker.kecamatan = JSON.parse(dataloker.kecamatan)
                dataloker.profesipekerjaan = arrayToObject(dataloker.profesipekerjaan)
                dataloker.jeniskelamin = arrayToObject(dataloker.jeniskelamin)
                dataloker.statuskerja = arrayToObject(dataloker.statuskerja)
                dataloker.pendidikan = arrayToObject(dataloker.pendidikan)
                // data loker

                // data perusahaan
                const inperushaan = dataloker.perusahaan
                if (inperushaan) {
                    // console.log(inperushaan)
                    inperushaan.alamatkabupaten = JSON.parse(inperushaan.alamatkabupaten)
                    inperushaan.alamatkecamatan = JSON.parse(inperushaan.alamatkecamatan)
                }
                dataloker.perusahaan = inperushaan
                // data perusahaan

                // data user
                const inuser = dataloker.user
                if (inuser) {
                    // console.log(inuser)
                    delete inuser.password
                    delete inuser.token
                    dataloker.user = inuser
                }
                // data user

                // push loker
                loker.push(dataloker)
                // push loker
            })
        }
        return loker
    }
    // return loker perbaiki data yang sudah di modifikasi

    // data yang boleh di kirim pada saat membuat dan mengedit loker
    static cekData(data) {
        const keyboleh = [
            'perusahaan', 'gaji',
            'umur', 'kabupaten',
            'kecamatan', 'lokasi',
            'email', 'nomorhp',
            'dropdown', 'deskripsi',
            'tampilkangaji', 'lamaronline',
            'lamaroffline', 'alamatkirimlamaran'
        ]
        let kembalikan = {}
        keyboleh.map(datanama => kembalikan = { ...kembalikan, [datanama]: data[datanama] })
        return kembalikan
    }
    // data yang boleh di kirim pada saat membuat dan mengedit loker

    // Create
    static async createLowongan(req, res) {
        try {
            // hapus trim terlebih dahulu
            req.body = removeSpacesServices(req.body)
            // hapus trim terlebih dahulu



            // console.log(req.body)
            // return res.status(500).json({ message: 'error' })
            // cek apakah gaji di sembunyikan atau tidak

            // error gagal mengirim lowongan pekerjaan
            const gagalmengirim = { ...LowonganPekerjaanController.messageerror, message: 'gagal mengirim lowongan pekerjaan' }
            // error gagal mengirim lowongan pekerjaan

            // dropdown
            const dropdown = req.body.dropdown
            if (!dropdown) {
                return res.status(400).json(gagalmengirim)
            }

            // profesi pekerjaan
            const validasiprofesipekerjaan = await LowonganPekerjaanController.validasiProfesiPekerjaan({ data: dropdown.profesipekerjaan, path: 'profesipekerjaan' })
            if (validasiprofesipekerjaan.error) {
                return res.status(400).json(validasiprofesipekerjaan)
            }
            // profesi pekerjaan

            // perusahaan
            const validasiperusahaan = await LowonganPekerjaanController.validasiPerusahaan({ perusahaan: req.body.perusahaan, path: 'perusahaan' }, req)
            if (validasiperusahaan.error) {
                return res.status(400).json(validasiperusahaan)
            }
            // perusahaan


            // jenis kelamin status kerja minimal pendidikan
            function sendToMethodvalidasiJKSKMP(path) {
                return LowonganPekerjaanController.validasiJenisKelaminStatusKerjaMinimalPendidikan({ path, data: dropdown })
            }
            const validasiJenisKelamin = sendToMethodvalidasiJKSKMP('jeniskelamin')
            if (validasiJenisKelamin.error) {
                return res.status(400).json(validasiJenisKelamin)
            }
            const validasiStatusKerja = sendToMethodvalidasiJKSKMP('statuskerja')
            if (validasiStatusKerja.error) {
                return res.status(400).json(validasiStatusKerja)
            }
            const validasipendidikan = sendToMethodvalidasiJKSKMP('pendidikan')
            if (validasipendidikan.error) {
                return res.status(400).json(validasipendidikan)
            }
            // jenis kelamin status kerja minimal pendidikan

            // gaji yang di berikan
            if (req.body?.tampilkangaji) {
                if (!req.body.gaji) {
                    return res.status(400).json({ error: true, message: "gaji harus di isi", path: 'gaji' })
                }
                req.body.gaji = req.body.gaji ? req.body.gaji.replace(/[^0-9]/g, '') : "disembunyikan"
                if (req.body.gaji !== "disembunyikan") {
                    // console.log(/^\d+$|^$/.test(req.body.gaji))
                    const gajiloker = Number.parseInt(req.body.gaji)
                    if (!isNaN(gajiloker)) {
                        if (gajiloker < 1000) {
                            return res.status(400).json({ error: true, message: "gaji minimal Rp. 1.000", path: 'gaji' })
                        } else if (gajiloker > 1000000000) {
                            return res.status(400).json({ error: true, message: "gaji maksimal Rp. 1.000.000.000.000", path: 'gaji' })
                        }
                    } else {
                        return res.status(400).json({ error: true, message: "gaji harus berupa angka", path: 'gaji' })
                    }
                }
            } else {
                req.body.gaji = "disembunyikan"
            }
            delete req.body.tampilkangaji
            const validasigaji = LowonganPekerjaanController.validasiInput({ path: 'gaji', data: req.body?.gaji })
            if (validasigaji.error) {
                return res.status(400).json(validasigaji)
            }
            // gaji yang di berikan


            // validasi umur maksimal
            const validasiumurmaksimal = LowonganPekerjaanController.validasiInput({ path: 'umur', data: req.body?.umur })
            if (validasiumurmaksimal.error) {
                return res.status(400).json(validasiumurmaksimal)
            }
            // validasi umur maksimal

            // validasi alamat tempat bekerja, kabupaten, kecamaran dan alamat lengkap
            const { kabupaten, kecamatan, lokasi } = req.body
            // validasi alamat
            const vlKabupaten = ValidationService.validasiAddressLoker(kabupaten, "kabupaten")
            if (vlKabupaten.error) {
                return res.status(400).json(vlKabupaten)
            }
            const vlKecamatan = ValidationService.validasiAddressLoker(kecamatan, "kecamatan", kabupaten?.kode)
            if (vlKecamatan.error) {
                return res.status(400).json(vlKecamatan)
            }
            const vlLokasi = ValidationService.validasiAddressLoker(lokasi, "lokasi")
            if (vlLokasi.error) {
                return res.status(400).json(vlLokasi)
            }
            // validasi alamat tempat bekerja, kabupaten, kecamaran dan alamat lengkap


            // validasi email, nomor hp dan alamat kirim lamaran
            // validasi kirim lamaran
            const { lamaronline, lamaroffline } = req.body
            if (typeof lamaronline !== "boolean" || typeof lamaroffline !== "boolean") {
                return res.status(400).json({ error: true, message: "Lamaran Online harus boolean", path: "lamaronline" })
            }
            if (!lamaronline && !lamaroffline) {
                return res.status(400).json({ error: true, message: "Pilih cara pelamar mengirim lamaran", path: "lamaronline" })
            }
            if (lamaroffline) {
                const { alamatkirimlamaran } = req.body
                const validasialamatkirimlamaran = ValidationService.validasiNomorhpEmailDeskripsi({ alamatkirimlamaran }, 'alamatkirimlamaran')
                if (validasialamatkirimlamaran.error) {
                    return res.status(400).json(validasialamatkirimlamaran)
                }
            }
            if (lamaronline) {
                const { email, nomorhp } = req.body
                const validasinomorhpemail = ValidationService.validasiNomorhpEmailDeskripsi({ email, nomorhp }, 'emailnomorhp')
                if (validasinomorhpemail.error) {
                    return res.status(400).json(validasinomorhpemail)
                }
            }
            // email whatsaap deskripsi
            const { deskripsi } = req.body

            const validasideskripsi = ValidationService.validasiNomorhpEmailDeskripsi({ deskripsi }, 'deskripsi')
            if (validasideskripsi.error) {
                return res.status(400).json(validasideskripsi)
            }
            // email whatsaap deskripsi

            // simpan lowongan pekerjaan
            const dataloker = LowonganPekerjaanController.remainingDataToSave(req.body)
            // simpan profesi pekerjaan
            const profesiindb = await prisma.profesipekerjaan.findMany({
                where: {
                    nama: {
                        in: dataloker.profesipekerjaan
                    }
                }
            })
            let simpeninikeprofesi = []
            if (profesiindb.length) {
                const semuasudah = profesiindb.map(data => data.nama)
                simpeninikeprofesi = dataloker.profesipekerjaan.filter(dt => !semuasudah.includes(dt))
            } else {
                simpeninikeprofesi = dataloker.profesipekerjaan
            }
            if (simpeninikeprofesi.length) {
                const newdataprofesi = []
                simpeninikeprofesi.map(data => newdataprofesi.push({ nama: data, userId: req.user.id }))
                // console.log(newdataprofesi)
                await prisma.profesipekerjaan.createMany({
                    data: newdataprofesi
                })
            }

            // lengkapi data
            dataloker.userId = req.user.id
            dataloker.perusahaanId = dataloker.perusahaan
            delete dataloker.perusahaan
            dataloker.profesipekerjaan = JSON.stringify(dataloker.profesipekerjaan)
            dataloker.jeniskelamin = JSON.stringify(dataloker.jeniskelamin)
            dataloker.statuskerja = JSON.stringify(dataloker.statuskerja)
            dataloker.pendidikan = JSON.stringify(dataloker.pendidikan)
            // lengkapi data

            // simpan data loker
            const saveloker = await prisma.lowonganpekerjaan.create({ data: req.body })
            const hasilback = LowonganPekerjaanController.replaceLokerToRealData([saveloker])
            return res.json({ loker: hasilback[0] })
            // return res.json({ loker: LowonganPekerjaanController.replaceLokerToRealData([saveloker][0]) })
        } catch (error) {
            return res.status(500).json({ message: 'error' })
        }
        // Logic for creating a new lowongan
    }


    // Read
    static async getLowongan(req, res) {
        try {

            let { id, inuser, rekomendasi, keyrekomendasi, skip, userlogin, profesi, pendidikan, statuskerja, kabupaten, fullfilter, manyid, gaji } = req.query
            // request dataloker untuk di edit 
            if (userlogin && userlogin === "true") {
                if (/^\d+$/.test(id)) {
                    const lokeruser = await prisma.lowonganpekerjaan.findUnique({
                        where: {
                            id: Number.parseInt(id),
                            userId: req.user.id
                        },
                        include: {
                            perusahaan: true
                        }
                    })
                    if (lokeruser) {
                        return res.json({ loker: LowonganPekerjaanController.replaceLokerToRealData([lokeruser]) })
                    } else {
                        return res.status(401).json({ error: true })
                    }
                } else {
                    return res.status(401).json({ error: true })
                }
            }

            // data return
            const returnvalue = {}

            // id="odo"
            let dataquery = { take: 10, skip: 0 }
            if (id && id?.length) {
                if (/^\d+$/.test(id)) {
                    dataquery.where = { ...dataquery.where, id: Number.parseInt(id) }
                }
            }
            if (inuser && inuser === "true") {
                if (req.userlogin) {
                    delete dataquery.where.id
                    dataquery.where = { ...dataquery.where, userId: req.user.id }
                }
            }
            if (skip && /^\d+$/.test(skip)) {
                dataquery.skip = Number.parseInt(skip) * 10
            }
            let profesioke = ""
            if (profesi && profesi.length) {
                profesioke = profesi.split("-").join(" ")
                dataquery.where = { ...dataquery.where, profesipekerjaan: { contains: profesioke } }
            }

            // filter berdasarkan gaji tertinggi
            if (gaji === "true") {
                const highestItem = await prisma.$queryRaw`
            SELECT * FROM lowonganpekerjaan
            ORDER BY CAST(REPLACE(REPLACE(gaji, ',', ''), ' ', '') AS UNSIGNED) DESC
            LIMIT 10;`;
                if (highestItem) {
                    if (highestItem.length) {
                        const semuaid = []
                        highestItem.map(data => {
                            semuaid.push(data.id)
                        })
                        if (semuaid.length) {
                            delete dataquery.skip
                            delete dataquery.take
                            dataquery.where = { id: { in: semuaid } }
                        }
                    }
                }
            }

            if (fullfilter) {
                const filter = fullfilter.split("|")
                let datawhere = {}
                const orstatuskerja = []
                if (filter.length) {
                    filter.map(data => {
                        const keyvalue = data.split("=")
                        if (keyvalue.length === 2) {
                            const valuepilihan = keyvalue[1].split("-").join(" ")
                            if (keyvalue[0] === "type") {
                                if (keyvalue[1].length) {
                                    datawhere = { ...datawhere, profesipekerjaan: { contains: valuepilihan } }
                                }
                            } else if (keyvalue[0] === "lokasi") {
                                if (valuepilihan.toUpperCase() !== "SEMUA LOKASI") {
                                    datawhere = { ...datawhere, kabupaten: { contains: valuepilihan } }
                                }
                            } else if (keyvalue[0] === "lulusan") {
                                if (valuepilihan.toUpperCase() !== "SEMUA LULUSAN") {
                                    datawhere = { ...datawhere, pendidikan: { contains: valuepilihan } }
                                }
                            } else if (keyvalue[0] === "fulltime") {
                                if (valuepilihan === "true") {
                                    orstatuskerja.push({
                                        statuskerja: { contains: "full time" }
                                    })
                                }
                            } else if (keyvalue[0] === "parttime") {
                                if (valuepilihan === "true") {
                                    orstatuskerja.push({
                                        statuskerja: { contains: "part time" }
                                    })
                                }
                            } else if (keyvalue[0] === "freelance") {
                                if (valuepilihan === "true") {
                                    orstatuskerja.push({
                                        statuskerja: { contains: "freelance" }
                                    })
                                }
                            } else if (keyvalue[0] === "magang") {
                                if (valuepilihan === "true") {
                                    orstatuskerja.push({
                                        statuskerja: { contains: "magang" }
                                    })
                                }
                            }
                        }
                    })
                }
                if (orstatuskerja.length) {
                    if (orstatuskerja.length > 1) {
                        datawhere = { ...datawhere, OR: orstatuskerja }
                    } else {
                        datawhere = { ...datawhere, ...orstatuskerja[0] }
                    }
                }
                // console.log(datawhere)
                dataquery.where = datawhere
            }
            // menambahkan query untuk filter lokasi,pendidikan dan statuskerja
            if (pendidikan && pendidikan.length) {
                dataquery.where = { ...dataquery.where, pendidikan: { contains: pendidikan } }
            } else if (statuskerja && statuskerja.length) {
                dataquery.where = { ...dataquery.where, statuskerja: { contains: statuskerja } }
            } else if (kabupaten && kabupaten.length) {
                dataquery.where = { ...dataquery.where, kabupaten: { contains: kabupaten } }
            }
            // many id
            if (manyid) {
                const allid = { setid: false, id: [] }
                if (typeof manyid === "string") {
                    if (manyid.split("-").length) {
                        const simpanid = []
                        manyid.split("-").map(idloker => {
                            if (/^\d+$/.test(idloker)) {
                                simpanid.push(Number.parseInt(idloker))
                            }
                        })
                        if (simpanid.length) {
                            allid.setid = true
                            allid.id = simpanid
                        }
                    }
                }
                if (allid.setid) {
                    delete dataquery.skip
                    delete dataquery.take
                    dataquery.where = { id: { in: allid.id } }
                }
            }
            // ambilloker yang di butuhkan
            const semualoker = prisma.lowonganpekerjaan.findMany({
                ...dataquery,
                include: {
                    perusahaan: true,
                    user: true
                },
                orderBy: {
                    id: "desc"
                }
            })
            // console.log(dataquery)
            // const totaldata = profesi ? prisma.lowonganpekerjaan.count({where:{profesipekerjaan:{contains:profesioke}}}) : prisma.lowonganpekerjaan.count()
            const totaldata = prisma.lowonganpekerjaan.count({ where: dataquery.where })
            const dataloker = await Promise.all([semualoker, totaldata])
            returnvalue.lowonganpekerjaan = LowonganPekerjaanController.replaceLokerToRealData(dataloker[0])
            returnvalue.totaldata = dataloker[1]
            // ambilloker yang di butuhkan

            if (rekomendasi === "true" && keyrekomendasi) {
                const reqrekomendasi = []
                if (returnvalue.lowonganpekerjaan.length) {
                    // console.log()
                    returnvalue.lowonganpekerjaan.map(data => {
                        data.profesipekerjaan.map(datadua => {
                            reqrekomendasi.push(
                                prisma.lowonganpekerjaan.findMany({
                                    where: {
                                        profesipekerjaan: {
                                            contains: datadua.nama
                                        }
                                    },
                                    include: {
                                        user: true,
                                        perusahaan: true
                                    },
                                    take: 10,
                                    orderBy: {
                                        id: 'desc'
                                    }
                                })
                            )
                        })
                    })
                    const hasilrekom = []
                    const getrekomendasi = await Promise.all(reqrekomendasi)
                    getrekomendasi.map(hasil => {
                        hasil.map(ss => hasilrekom.push(ss))
                    })
                    const backdata = []
                    if (hasilrekom.length) {
                        let uniqueData = new Map();
                        hasilrekom.forEach(item => {
                            uniqueData.set(item.id, item);
                        });
                        let filteredArray = Array.from(uniqueData.values());
                        filteredArray.map(data => data.id !== returnvalue.lowonganpekerjaan[0].id ? backdata.push(data) : null)
                    }
                    returnvalue.rekomendasi = LowonganPekerjaanController.replaceLokerToRealData(backdata)
                }
            }
            // coba query


            return res.json(returnvalue)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'error' })
        }
    }

    // Update
    static async updateLowongan(req, res) {
        try {
            const { id } = req.query
            if (!/^\d+$/.test(id)) {
                return res.status(400).json({ error: true, message: 'gagal perbarui loker', path: 'perusahaan' })
            }
            const cariaksesloker = await prisma.lowonganpekerjaan.findUnique({
                where: {
                    id: Number.parseInt(id),
                    userId: req.user.id
                }
            })
            if (!cariaksesloker) {
                return res.status(400).json({ error: true, message: 'gagal perbarui loker', path: 'perusahaan' })
            }
            req.body = LowonganPekerjaanController.cekData(req.body)
            // hapus trim terlebih dahulu
            req.body = removeSpacesServices(req.body)
            // hapus trim terlebih dahulu



            // return res.status(500).json({ message: 'error' })

            // error gagal mengirim lowongan pekerjaan
            const gagalmengirim = { ...LowonganPekerjaanController.messageerror, message: 'gagal perbarui lowongan pekerjaan' }
            // error gagal mengirim lowongan pekerjaan

            // dropdown
            const dropdown = req.body.dropdown
            if (!dropdown) {
                return res.status(400).json(gagalmengirim)
            }

            // profesi pekerjaan
            const validasiprofesipekerjaan = await LowonganPekerjaanController.validasiProfesiPekerjaan({ data: dropdown.profesipekerjaan, path: 'profesipekerjaan' })
            if (validasiprofesipekerjaan.error) {
                return res.status(400).json(validasiprofesipekerjaan)
            }
            // profesi pekerjaan

            // perusahaan
            const validasiperusahaan = await LowonganPekerjaanController.validasiPerusahaan({ perusahaan: req.body.perusahaan, path: 'perusahaan' }, req)
            if (validasiperusahaan.error) {
                return res.status(400).json(validasiperusahaan)
            }
            // perusahaan


            // jenis kelamin status kerja minimal pendidikan
            function sendToMethodvalidasiJKSKMP(path) {
                return LowonganPekerjaanController.validasiJenisKelaminStatusKerjaMinimalPendidikan({ path, data: dropdown })
            }
            const validasiJenisKelamin = sendToMethodvalidasiJKSKMP('jeniskelamin')
            if (validasiJenisKelamin.error) {
                return res.status(400).json(validasiJenisKelamin)
            }
            const validasiStatusKerja = sendToMethodvalidasiJKSKMP('statuskerja')
            if (validasiStatusKerja.error) {
                return res.status(400).json(validasiStatusKerja)
            }
            const validasipendidikan = sendToMethodvalidasiJKSKMP('pendidikan')
            if (validasipendidikan.error) {
                return res.status(400).json(validasipendidikan)
            }
            // jenis kelamin status kerja minimal pendidikan

            // gaji yang di berikan
            // console.log(req.body)
            if (req.body?.tampilkangaji) {
                if (!req.body.gaji) {
                    return res.status(400).json({ error: true, message: "gaji harus di isi", path: 'gaji' })
                }
                req.body.gaji = req.body.gaji ? req.body.gaji.replace(/[^0-9]/g, '') : "disembunyikan"
                if (req.body.gaji !== "disembunyikan") {
                    // console.log(/^\d+$|^$/.test(req.body.gaji))
                    const gajiloker = Number.parseInt(req.body.gaji)
                    if (!isNaN(gajiloker)) {
                        if (gajiloker < 1000) {
                            return res.status(400).json({ error: true, message: "gaji minimal Rp. 1.000", path: 'gaji' })
                        } else if (gajiloker > 1000000000) {
                            return res.status(400).json({ error: true, message: "gaji maksimal Rp. 1.000.000.000.000", path: 'gaji' })
                        }
                    } else {
                        return res.status(400).json({ error: true, message: "gaji harus berupa angka", path: 'gaji' })
                    }
                }
            } else {
                req.body.gaji = "disembunyikan"
            }
            // console.log(req.body)
            delete req.body.tampilkangaji
            const validasigaji = LowonganPekerjaanController.validasiInput({ path: 'gaji', data: req.body?.gaji })
            if (validasigaji.error) {
                return res.status(400).json(validasigaji)
            }
            // gaji yang di berikan


            // validasi umur maksimal
            const validasiumurmaksimal = LowonganPekerjaanController.validasiInput({ path: 'umur', data: req.body?.umur })
            if (validasiumurmaksimal.error) {
                return res.status(400).json(validasiumurmaksimal)
            }
            // validasi umur maksimal

            // validasi alamat tempat bekerja, kabupaten, kecamaran dan alamat lengkap
            const { kabupaten, kecamatan, lokasi } = req.body
            // validasi alamat
            const vlKabupaten = ValidationService.validasiAddressLoker(kabupaten, "kabupaten")
            if (vlKabupaten.error) {
                return res.status(400).json(vlKabupaten)
            }
            const vlKecamatan = ValidationService.validasiAddressLoker(kecamatan, "kecamatan", kabupaten?.kode)
            if (vlKecamatan.error) {
                return res.status(400).json(vlKecamatan)
            }
            const vlLokasi = ValidationService.validasiAddressLoker(lokasi, "lokasi")
            if (vlLokasi.error) {
                return res.status(400).json(vlLokasi)
            }
            // validasi alamat tempat bekerja, kabupaten, kecamaran dan alamat lengkap

            // lamar offline atau offline
            const { lamaronline, lamaroffline } = req.body
            if (typeof lamaronline !== "boolean" || typeof lamaroffline !== "boolean") {
                return res.status(400).json({ error: true, message: "Lamaran Online harus boolean", path: "lamaronline" })
            }
            if (!lamaronline && !lamaroffline) {
                return res.status(400).json({ error: true, message: "Pilih cara pelamar mengirim lamaran", path: "lamaronline" })
            }
            if (lamaroffline) {
                const { alamatkirimlamaran } = req.body
                const validasialamatkirimlamaran = ValidationService.validasiNomorhpEmailDeskripsi({ alamatkirimlamaran }, 'alamatkirimlamaran')
                if (validasialamatkirimlamaran.error) {
                    return res.status(400).json(validasialamatkirimlamaran)
                }
            }
            if (lamaronline) {
                const { email, nomorhp } = req.body
                const validasinomorhpemail = ValidationService.validasiNomorhpEmailDeskripsi({ email, nomorhp }, 'emailnomorhp')
                if (validasinomorhpemail.error) {
                    return res.status(400).json(validasinomorhpemail)
                }
            }

            // console.log(req.body)

            // console.log(req.body)
            if (lamaronline && !lamaroffline) {
                req.body.alamatkirimlamaran = ""
            } else if (!lamaronline && lamaroffline) {
                req.body.email = ""
                req.body.nomorhp = ""
            }
            // lamar offline atau offline

            // email whatsaap deskripsi
            const { deskripsi } = req.body
            // const validasinomorhpemail = ValidationService.validasiNomorhpEmailDeskripsi({ email, nomorhp }, 'emailnomorhp')
            // if (validasinomorhpemail.error) {
            //     return res.status(400).json(validasinomorhpemail)
            // }
            const validasideskripsi = ValidationService.validasiNomorhpEmailDeskripsi({ deskripsi }, 'deskripsi')
            if (validasideskripsi.error) {
                return res.status(400).json(validasideskripsi)
            }
            // email whatsaap deskripsi

            // update lowongan pekerjaan
            const dataloker = LowonganPekerjaanController.remainingDataToSave(req.body)
            // console.log(dataloker)
            // return res.status(500).json({ message: 'error' })
            // simpan profesi pekerjaan
            const profesiindb = await prisma.profesipekerjaan.findMany({
                where: {
                    nama: {
                        in: dataloker.profesipekerjaan
                    }
                }
            })
            let simpeninikeprofesi = []
            if (profesiindb.length) {
                const semuasudah = profesiindb.map(data => data.nama)
                simpeninikeprofesi = dataloker.profesipekerjaan.filter(dt => !semuasudah.includes(dt))
            } else {
                simpeninikeprofesi = dataloker.profesipekerjaan
            }
            if (simpeninikeprofesi.length) {
                const newdataprofesi = []
                simpeninikeprofesi.map(data => newdataprofesi.push({ nama: data, userId: req.user.id }))
                // console.log(newdataprofesi)
                await prisma.profesipekerjaan.createMany({
                    data: newdataprofesi
                })
            }
            // simpan profesi pekerjaan
            //lengkapi data
            dataloker.userId = req.user.id
            dataloker.perusahaanId = dataloker.perusahaan
            delete dataloker.perusahaan
            dataloker.profesipekerjaan = JSON.stringify(dataloker.profesipekerjaan)
            dataloker.jeniskelamin = JSON.stringify(dataloker.jeniskelamin)
            dataloker.statuskerja = JSON.stringify(dataloker.statuskerja)
            dataloker.pendidikan = JSON.stringify(dataloker.pendidikan)
            // update lowongan pekerjaan
            const updateloker = await prisma.lowonganpekerjaan.update({
                where: { id: cariaksesloker.id },
                data: dataloker
            })
            const hasilback = LowonganPekerjaanController.replaceLokerToRealData([updateloker])
            return res.json({ loker: hasilback[0] })
        } catch (error) {
            console.log(error)
            // console.log(error)
            return res.status(500).json({ oke: 'error' })
        }
    }

    // Delete
    static async deleteLowongan(req, res) {
        try {
            const { id } = req.params
            if (!/^\d+$/.test(id)) {
                return res.status(400).json({ error: true, message: 'gagal hapus lowongan pekerjaan', path: 'perusahaan' })
            }
            const dataloker = await prisma.lowonganpekerjaan.findUnique({
                where: {
                    id: Number.parseInt(id)
                },
                include: {
                    user: true
                }
            })
            if (!dataloker) {
                return res.status(404).json({ error: true, message: 'lowongan pekerjaan tidak di temukan', path: 'perusahaan' })
            }
            const { userId } = dataloker
            if (userId !== req.user.id) {
                if (req.user.role !== "ADMIN") {
                    return res.status(401).json({ error: true, message: 'gagal hapus lowongan pekerjaan tidak punya akses ke data ini', path: 'perusahaan' })
                }
            }
            // lanjutkan hapus loker
            await prisma.lowonganpekerjaan.delete({ where: { id: dataloker.id } })
            return res.json({ error: false })
        } catch (error) {
            return res.status(500).json({ error: true })
        }
    }
}

module.exports = LowonganPekerjaanController;