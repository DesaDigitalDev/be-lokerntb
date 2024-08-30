
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authRouter = require('./app/AuthUser/router');
const registerCompanyRouter = require('./app/RegisterCompany/router');
const profesipekerjaanRouter = require('./app/ProfesiPekerjaan/router');
const lowonganpekerjaanRouter = require('./app/LowonganPekerjaan/router');
const adminRouter = require('./app/Admin/router');


// Daftar origin yang diizinkan
const allowedOrigins = [
  'https://lokerntb.id',
  'https://www.lokerntb.id',
  'http://localhost:3000'
];


// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true,
// };
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function main() {
//   try {
//     await prisma.$connect();
//     console.log('Koneksi ke database MySQL melalui Prisma berhasil!');
//   } catch (error) {
//     console.error('Gagal terhubung ke database:', error.message);
//   }
// }

// main();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors(corsOptions));


// cors
// Middleware CORS
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      // Izinkan permintaan dari origin yang ada dalam daftar atau tidak ada origin (misalnya, dari server-side)
      callback(null, true);
    } else {
      // Tolak permintaan dari origin yang tidak ada dalam daftar
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/',authRouter)
app.use('/company',registerCompanyRouter)
app.use('/profesi-pekerjaan',profesipekerjaanRouter)
app.use('/lowongan-pekerjaan',lowonganpekerjaanRouter)

// admin
app.use('/admin',adminRouter)

// app.get('/', (req, res) => {
//   res.send('Selamat datang di API om');
// });

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
