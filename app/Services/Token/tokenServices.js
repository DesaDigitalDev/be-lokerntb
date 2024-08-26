const jwt = require('jsonwebtoken');
const config = require('../../config');
const bcrypt = require('bcrypt');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class TokenService {
    static generateToken(payload, expiredtoken = '7d') {
        const token = jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: expiredtoken });
        return token;
    }

    static verifyToken(token) {
        try {
            const decoded = jwt.verify(token, config.TOKEN_SECRET);
            return { valid: true, decoded };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    static async accessVerifyToken(req) {
        try {
            let userlogin = true
            let token = req.cookies['lokerntb'];
            const userAgent = req.headers['user-agent'];
            const token_pembantu = req.headers.authorization
            if (!token) {
                if (token_pembantu?.split(' ').length === 2) {
                    token = token_pembantu.split(' ')[1]
                } else {
                    userlogin = false
                }
            }
            const verificationResult = TokenService.verifyToken(token);
            if (!verificationResult.valid) {
                userlogin = false
            }
            // hashing user agent
            const tokenagent = verificationResult?.decoded?.sesionlogin
            const verificationAgentResult = TokenService.verifyToken(tokenagent);
            if (!verificationAgentResult.valid) {
                userlogin = false
            }
            const validAgent = await bcrypt.compare(userAgent, verificationAgentResult.decoded.sesionlogin);
            if (!validAgent) {
                userlogin = false
            }
            const datauser = verificationResult.decoded
            const user = await prisma.user.findUnique({
                where: {
                    id: datauser.id
                }
            });
            if (!user) {
                userlogin = false
            }
            if (user.token !== token) {
                userlogin = false
            }
            req.userlogin=userlogin
            req.token = token
            req.user = verificationResult.decoded
            return req
        } catch (error) {
            return res.userlogin=false
        }
    }

    static async authenticateRequest(req, res, next) {
        const defaultMessage = { message: "Akses ditolak. Tidak ada token yang diberikan.",error:true }

        try {
            let token = req.cookies['lokerntb'];
            const userAgent = req.headers['user-agent'];
            const token_pembantu = req.headers.authorization
            if (!token) {
                if (token_pembantu?.split(' ').length === 2) {
                    token = token_pembantu.split(' ')[1]
                } else {
                    return res.status(401).json(defaultMessage);
                }
            }
            // verifikasi token
            const verificationResult = TokenService.verifyToken(token);
            if (!verificationResult.valid) {
                return res.status(401).json(defaultMessage);
            }
            // hashing user agent
            const tokenagent = verificationResult?.decoded?.sesionlogin
            const verificationAgentResult = TokenService.verifyToken(tokenagent);
            if (!verificationAgentResult.valid) {
                return res.status(401).json(defaultMessage);
            }
            const validAgent = await bcrypt.compare(userAgent, verificationAgentResult.decoded.sesionlogin);
            if (!validAgent) {
                return res
                    .status(401)
                    .json(defaultMessage);
            }
            const datauser = verificationResult.decoded
            const user = await prisma.user.findUnique({
                where: {
                    id: datauser.id
                }
            });
            if (!user) {
                return res.status(401).json(defaultMessage);
            }
            if (user.token !== token) {
                return res.status(401).json(defaultMessage);
            }
            req.token = token
            req.user = verificationResult.decoded
            return next()
        } catch (error) {
            res.status(401).json(defaultMessage);
        }
    }

    static async userWithTokenOrNoToken(req, res, next) {
        try {
            await TokenService.accessVerifyToken(req)
            return next()
        } catch (error) {
            req.userlogin = false
            return next()
        }
    }

    // validasi admin request
    static async adminRequest(req,res,next){
        const defaultMessage = { message: "Akses ditolak. Tidak ada token yang diberikan.",error:true }
        try {
            if(req.user.role === "ADMIN"){
                return next()
            }
            return res.status(401).json(defaultMessage)
        } catch (error) {
            return res.status(401).json(defaultMessage)
        }
    }
}

module.exports = TokenService;
