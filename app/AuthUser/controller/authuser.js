const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const TokenService = require("../../Services/Token/tokenServices");
const { userValidationSchema, validateEmailAndPassword } = require("../../Services/Validation/JoiValidation");
const removeSpacesServices = require("../../Services/RemoveSpace/RemoveSpaceService");
const {validateObjectKeys,checkArrayValuesInCounter} = require("../../Services/KeysApproved/KeysApprovedServices");

class AuthUserController {
  static async registerUser(req, res) {
    const hasilValidasiKeys = validateObjectKeys(req.body, ['email', 'password', 'konfirmasi_password','nama']);
    if (hasilValidasiKeys.error) {
      return res.status(400).json({ message: hasilValidasiKeys.message,path :'email' });
    }
    req.body = removeSpacesServices(hasilValidasiKeys.data)
    const { error} = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        path: error.details[0].path.join('.')
      });
    }
    try {
      // Pengecekan email di database
      req.body.email = req.body.email.toLowerCase();
      const existingUser = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email sudah terdaftar", path: "email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword
      // Menyimpan user baru ke database
      delete req.body.konfirmasi_password
      await prisma.user.create({
        data: req.body
      });
      return res.status(200).json({ message: "Pendaftaran berhasil!" });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Terjadi kesalahan pada server",
          error: error.message,
          path: "",
        });
    }
  }
  static async loginUser(req, res) {
    req.body = removeSpacesServices(req.body)
    const { error } = validateEmailAndPassword.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "gagal masuk akun. periksa email dan password",
        path: "email"
      });
    }
    try {
      req.body.email = req.body.email.toLowerCase();
      // Pengecekan email di database
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        return res
          .status(400)
          .json({
            message: "email belum terdaftar",
            path: "email",
          });
      }

      // Pengecekan password
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res
          .status(400)
          .json({
            message: "gagal masuk akun. periksa email dan password",
            path: "email",
          });
      }

      // Login berhasil
      delete user.password;
      delete user.token;
      // ambil useragent user sebagai penanda token

      const userAgent = await bcrypt.hash(req.headers["user-agent"], 10);
      const tokenPayload = {
        ...user,
        sesionlogin: TokenService.generateToken({ sesionlogin: userAgent }),
      };
      const token = TokenService.generateToken(tokenPayload);
      // Update token user di database
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          token: token,
        },
      });
      res.cookie("lokerntb", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
        domain: 'lokerntb.id',
        path: '/',
      });
      return res.status(200).json({ message: "Login berhasil!", user, token });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Terjadi kesalahan pada server",
          error: error.message,
          path: "",
        });
    }
  }
  static async logoutUser(req, res) {
    const datauser = req.user
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: datauser.id
        }
      });
      if (!user) {
        return res.status(401).json({ message: "User tidak ditemukan" });
      }
      if (user.token !== req.token) {
        return res.status(401).json({ message: "User tidak ditemukan" });
      }
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          token: null
        }
      })
      res.clearCookie('lokerntb');
      return res.json({})
    } catch (prismaError) {
      return res.status(500).json({
        message: "Kesalahan saat mengambil data user",
        error: prismaError.message
      });
    }
  }
  static async getUser(req, res) {
    const datauser ={
      token : req.token,
      user:req.user
    }
    return res.json(datauser)
  }
  static async updateUser(req, res) {
    const keys = Object.keys(req.body);
    if(!keys.length){
      return res.status(201).json({message:"tidak ada data yang diubah"})
    }
    const keysapproved = ['email', 'password','nama']
    if(!checkArrayValuesInCounter(keys,keysapproved)){
      return res.status(400).json({message:"key tidak diizinkan"})
    }
    req.body = removeSpacesServices(req.body)
    const { error} = userValidationSchema.validate(req.body);
    if (error) {
      const path = error.details[0].path[0]
      if(keys.includes(path)){
        return res.status(400).json({
          message: error.details[0].message,
          path
        });
      }
    }
    const data = req.body
    if(keys.includes('email')){
      req.body.email = req.body.email.toLowerCase()
      const cariemailsudahterdaftar = await prisma.user.findUnique({
        where: {
          email: req.body.email
        }
      })
      if(cariemailsudahterdaftar){
        if(cariemailsudahterdaftar.id === req.user.id){
          delete req.body.email
        }else{
          return res.status(400).json({message:"email sudah terdaftar",path:"email"})
        }
      }
    }
    if(data.password){
      data.password = await bcrypt.hash(data.password, 10)
    }
    // update data user
    const datatokenbaru = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data
    })
    delete datatokenbaru.password
    delete datatokenbaru.token

    // membuat token baru
    const userAgent = await bcrypt.hash(req.headers["user-agent"], 10);
    const tokenPayload = {
      ...datatokenbaru,
      sesionlogin: TokenService.generateToken({ sesionlogin: userAgent }),
    };
    const token = TokenService.generateToken(tokenPayload);
    // Update token user di database
    await prisma.user.update({
      where: {
        id: datatokenbaru.id,
      },
      data: {
        token: token,
      },
    });
    res.cookie("lokerntb", token, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
    });
    return res.status(200).json({ message: "Data berhasil di perbarui!", user:datatokenbaru, token });
  }
}

module.exports = AuthUserController;
