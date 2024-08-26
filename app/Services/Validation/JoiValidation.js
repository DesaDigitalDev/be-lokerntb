const Joi = require('joi');

const userValidationSchema = Joi.object({
    nama: Joi.string().min(3).max(200).required().messages({
        'string.base': 'Nama harus berupa teks',
        'string.empty': 'Nama tidak boleh kosong',
        'string.min': 'Nama harus memiliki minimal 3 karakter',
        'string.max': 'Nama harus memiliki maksimal 200 karakter',
        'any.required': 'Nama wajib diisi'
    }),
    email: Joi.string().email({ tlds: { allow: ['com', 'net', 'id'] } }).required().messages({
        'string.email': 'Email harus valid dan termasuk domain yang diperbolehkan (.com, .net, .id)',
        'string.empty': 'Email tidak boleh kosong',
        'any.required': 'Email wajib diisi'
    }),
    password: Joi.string().min(6).max(100).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$')).required().messages({
        'string.base': 'Password harus berupa teks',
        'string.empty': 'Password tidak boleh kosong',
        'string.min': 'Password harus memiliki minimal 6 karakter',
        'string.max': 'Password harus memiliki maksimal 100 karakter',
        'string.pattern.base': 'Password harus mengandung huruf besar, huruf kecil, dan angka',
        'any.required': 'Password wajib diisi'
    }),
    konfirmasi_password: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Konfirmasi password tidak cocok',
        'any.required': 'Konfirmasi password wajib diisi'
    })
}).with('password', 'konfirmasi_password');

const validateEmailAndPassword = Joi.object({
    email: Joi.string().email({ tlds: { allow: ['com', 'net', 'id'] } }).required().messages({
        'string.email': 'Email harus valid dan termasuk domain yang diperbolehkan (.com, .net, .id)',
        'string.empty': 'Email tidak boleh kosong',
        'any.required': 'Email wajib diisi'
    }),
    password: Joi.string().min(6).max(100).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$')).required().messages({
        'string.base': 'Password harus berupa teks',
        'string.empty': 'Password tidak boleh kosong',
        'string.min': 'Password harus memiliki minimal 6 karakter',
        'string.max': 'Password harus memiliki maksimal 100 karakter',
        'string.pattern.base': 'Password harus mengandung huruf besar, huruf kecil, dan angka',
        'any.required': 'Password wajib diisi'
    })
});

const bisangUsahaValidation = Joi.object({
    nama: Joi.string().min(3).max(255).required().messages({
        'string.base': 'Nama harus berupa teks',
        'string.empty': 'Nama tidak boleh kosong',
        'string.min': 'Nama harus memiliki minimal 3 karakter',
        'string.max': 'Nama harus memiliki maksimal 255 karakter',
        'any.required': 'Nama wajib diisi'
    })
});

const perusahaanValidation = Joi.object({
    namaperusahaan: Joi.string().min(3).max(255).required().messages({
        'string.base': 'Nama perusahaan harus berupa teks',
        'string.empty': 'Nama perusahaan tidak boleh kosong',
        'string.min': 'Nama perusahaan harus memiliki minimal 3 karakter',
        'string.max': 'Nama perusahaan harus memiliki maksimal 255 karakter',
        'any.required': 'Nama perusahaan wajib diisi'
    }),
    bidangusaha: Joi.string().min(3).max(255).required().messages({
        'string.base': 'Bidang usaha harus berupa teks',
        'string.empty': 'Bidang usaha tidak boleh kosong',
        'string.min': 'Bidang usaha harus memiliki minimal 3 karakter',
        'string.max': 'Bidang usaha harus memiliki maksimal 255 karakter',
        'any.required': 'Bidang usaha wajib diisi'
    }),
    alamatperusahaan: Joi.string().min(10).max(500).required().messages({
        'string.base': 'Alamat perusahaan harus berupa teks',
        'string.empty': 'Alamat perusahaan tidak boleh kosong',
        'string.min': 'Alamat perusahaan harus memiliki minimal 10 karakter',
        'string.max': 'Alamat perusahaan harus memiliki maksimal 500 karakter',
        'any.required': 'Alamat perusahaan wajib diisi'
    }),
    emailperusahaan: Joi.string().email({ tlds: { allow: ['com', 'net', 'id'] } }).required().messages({
        'string.email': 'Email perusahaan harus valid dan termasuk domain yang diperbolehkan (.com, .net, .id)',
        'string.empty': 'Email perusahaan tidak boleh kosong',
        'any.required': 'Email perusahaan wajib diisi'
    }),
    teleponperusahaan: Joi.string().pattern(new RegExp('^[0-9]+$')).min(10).max(15).required().messages({
        'string.base': 'Telepon perusahaan harus berupa angka',
        'string.empty': 'Telepon perusahaan tidak boleh kosong',
        'string.pattern.base': 'Telepon perusahaan hanya boleh mengandung angka',
        'string.min': 'Telepon perusahaan harus memiliki minimal 10 angka',
        'string.max': 'Telepon perusahaan harus memiliki maksimal 15 angka',
        'any.required': 'Telepon perusahaan wajib diisi'
    }),
    jumlahkaryawan: Joi.number().min(1).required().messages({
        'number.base': 'Jumlah karyawan harus berupa angka',
        'number.min': 'Jumlah karyawan minimal adalah 1',
        'any.required': 'Jumlah karyawan wajib diisi'
    }),
    website: Joi.string().uri().allow('').optional().messages({
        'string.uri': 'Format website tidak valid'
    })
});


class LokerValidation {
    static validateLokasi(lokasi) {
        return Joi.string().min(10).max(500).required().messages({
            'string.base': 'Lokasi harus berupa teks',
            'string.empty': 'Lokasi tidak boleh kosong',
            'string.min': 'Lokasi harus memiliki minimal 10 karakter',
            'string.max': 'Lokasi harus memiliki maksimal 500 karakter',
            'any.required': 'Lokasi wajib diisi'
        }).validate(lokasi);
    }

    static validateEmail(email) {
        return Joi.string().email({ tlds: { allow: ['com', 'net', 'id'] } }).messages({
            'string.email': 'Email harus valid dan termasuk domain yang diperbolehkan (.com, .net, .id)',
            'string.empty': 'Email tidak boleh kosong',
        }).validate(email);
    }

    static validateNomorHp(nomorhp) {
        return Joi.string().pattern(new RegExp('^[0-9]+$')).min(10).max(15).messages({
            'string.base': 'Telepon perusahaan harus berupa angka',
            'string.empty': 'Telepon perusahaan tidak boleh kosong',
            'string.pattern.base': 'Telepon perusahaan hanya boleh mengandung angka',
            'string.min': 'Telepon perusahaan harus memiliki minimal 10 angka',
            'string.max': 'Telepon perusahaan harus memiliki maksimal 15 angka',
        }).validate(nomorhp);
    }

    static validateGaji(gaji) {
        return Joi.string().min(2).max(100).required().messages({
            'string.base': 'Gaji harus berupa angka',
            'string.min': 'Gaji minimal adalah 2',
            'string.max': 'Gaji maksimal adalah 100',
            'any.required': 'Gaji wajib diisi'
        }).validate(gaji);
    }

    static validateUmur(umur) {
        return Joi.string().min(2).max(100).required().messages({
            'string.base': 'Umur harus berupa angka',
            'string.min': 'Umur minimal adalah 2',
            'string.max': 'Umur maksimal adalah 100',
            'any.required': 'Umur wajib diisi'
        }).validate(umur);
    }
}



module.exports = {userValidationSchema, validateEmailAndPassword,bisangUsahaValidation,perusahaanValidation,LokerValidation};

