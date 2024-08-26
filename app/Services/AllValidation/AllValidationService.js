const { kabupaten, kecamatan } = require("daftar-wilayah-indonesia");
const { LokerValidation } = require("../Validation/JoiValidation");
class ValidationService {
    static isOnlyNumbers(value) {
        return /^\d+$/.test(value);
    }
    // buat validasi alamat
    static isValidAddress(value, body, type = "kabupaten") {
        const responseback = { message: `alamat ${type} tidak boleh kosong`, path: "alamat" + type, error: true }
        if (!value) {
            return responseback
        } else {
            const addressString = JSON.stringify(value);
            if (type === "kabupaten") {
                const semuakabupaten = []
                kabupaten('52').map((item) => {
                    semuakabupaten.push(JSON.stringify(item))
                })
                if (semuakabupaten.includes(addressString)) {
                    return { ...responseback, error: false }
                } else {
                    return responseback
                }
            } else if (type === "kecamatan") {
                const simpansemuakecamatan = []
                kecamatan(body?.alamatkabupaten?.kode).map((item) => {
                    simpansemuakecamatan.push(JSON.stringify(item))
                })
                if (simpansemuakecamatan.includes(addressString)) {
                    return { ...responseback, error: false }
                } else {
                    return responseback
                }
            }
        }
    }

    static validasiAddressLoker(value, path, kode = null) {
        const dataerror = { error: false, message: `${path} tidak boleh kosong`, path }
        if (path === "kabupaten") {
            const semuakabupaten = []
            kabupaten('52').map((item) => {
                semuakabupaten.push(JSON.stringify(item))
            })
            if (!semuakabupaten.includes(JSON.stringify(value))) {
                dataerror.error = true
                dataerror.message = `${path} tidak ada`
            }
        } else if (path === "kecamatan") {
            if (kode) {
                const semuakecamatan = []
                kecamatan(kode).map((item) => {
                    semuakecamatan.push(JSON.stringify(item))
                })
                if (!semuakecamatan.includes(JSON.stringify(value))) {
                    dataerror.error = true
                    dataerror.message = `${path} tidak boleh kosong`
                }
            }
        } else if (path === "lokasi") {
            const { error } = LokerValidation.validateLokasi(value)
            if (error) {
                    dataerror.error = true
                dataerror.message = error.details[0].message
                dataerror.path = "lokasi"
            }
        }
        return dataerror
    }

    static validasiNomorhpEmailDeskripsi(value, path) {
        const dataerror = { error: false, message: `${path} tidak boleh kosong`, path }
        if (path === "emailnomorhp") {
            const { email, nomorhp } = value
            if (!email && !nomorhp) {
                dataerror.error = true
                dataerror.message = `harus ada email atau nomor yang bisa di hubungi`
                dataerror.path = "email"
            } else {
                if (email && !dataerror.error) {
                    const { error } = LokerValidation.validateEmail(email)
                    if(error){
                        dataerror.error=true
                        dataerror.message=error.details[0].message
                        dataerror.path="email"
                    }
                }
                if (nomorhp && !dataerror.error) {
                    const { error } = LokerValidation.validateNomorHp(nomorhp)
                    if(error){
                        dataerror.error=true
                        dataerror.message=error.details[0].message
                        dataerror.path="nomorhp"
                    }
                }
            }
        }else if(path === "deskripsi"){
            const {deskripsi}=value
            if(!deskripsi){
                dataerror.error=true
                dataerror.message=`${path} tidak boleh kosong`
                dataerror.path=path
            }else{
                if(deskripsi.length<100||deskripsi.length>10000){
                    dataerror.error=true
                    dataerror.message=`${path} harus antara 100 sampai 10.000 karakter`
                    dataerror.path=path
                }
            }
        }else if(path === "alamatkirimlamaran"){
            const {alamatkirimlamaran}=value
            if(!alamatkirimlamaran){
                dataerror.error=true
                dataerror.message=`Alamat kirim lamaran tidak boleh kosong`
                dataerror.path=path
            }else{
                if(alamatkirimlamaran.length<10||alamatkirimlamaran.length>255){
                    dataerror.error=true
                    dataerror.message=`Alamat kirim lamaran harus antara 10 sampai 255 karakter`
                    dataerror.path=path
                }
            }
        }
        return dataerror
    }
}
module.exports = ValidationService;
