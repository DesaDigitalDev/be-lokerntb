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

module.exports = {userValidationSchema, validateEmailAndPassword};

