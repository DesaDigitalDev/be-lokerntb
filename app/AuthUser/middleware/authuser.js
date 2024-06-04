const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const ValidationUser = require('../../Services/Validation/validationUser');
const TokenService = require('../../Services/Token/tokenServices');

class AuthUserController {
    static async registerUser(req, res) {
        const { email, password } = req.body;
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi!', path: 'email' });
        }

        try {
            // cek tipe email
            if (!ValidationUser.cekFormatEmail(email)) {
                return res.status(400).json({ message: 'Format email tidak valid! Gunakan format: contoh@domain.com', path: 'email' });
            }
            // Pengecekan email di database
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (existingUser) {
                return res.status(409).json({ message: 'Email sudah terdaftar', path: 'email' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Menyimpan user baru ke database
            await prisma.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    role: 'USER'
                }
            });
            return res.status(200).json({ message: 'Pendaftaran berhasil!' });
        } catch (error) {
            res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message, path: '' });
        }
    }
    static async loginUser(req, res) {
        const { email, password } = req.body;
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi!', path: 'email' });
        }

        try {
            // format email
            if (!ValidationUser.cekFormatEmail(email)) {
                return res.status(400).json({ message: 'Format email tidak valid! Gunakan format: contoh@domain.com', path: 'email' });
            }
            // Pengecekan email di database
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (!user) {
                return res.status(404).json({ message: 'Email tidak terdaftar', path: 'email' });
            }

            // Pengecekan password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Password salah', path: 'password' });
            }

            // Login berhasil
            delete user.password;
            delete user.token;
            // ambil useragent user sebagai penanda token
            
            const userAgent = await bcrypt.hash(req.headers['user-agent'], 10);
            const tokenPayload = {
                id: user.id,
                email: user.email,
                role: user.role,
                userAgent: TokenService.generateToken({userAgent})
            };
            const token = TokenService.generateToken(tokenPayload);
            console.log(token)
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
            });
            return res.status(200).json({ message: 'Login berhasil!',user });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message, path: '' });
        }
    }
}

module.exports = AuthUserController;
