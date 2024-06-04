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
            console.log(error)
            return { valid: false, error: error.message };
        }
    }

    static async authenticateRequest(req, res, next) {
        const defaultMessage = { message: "Akses ditolak. Tidak ada token yang diberikan." }
        const token = req.cookies['lokerntb'];
        const userAgent = req.headers['user-agent'];
        if (!token) {
            return res.status(401).json(defaultMessage);
        }

        try {

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
            next()
        } catch (error) {
            res.status(401).json(defaultMessage);
        }
    }
}

module.exports = TokenService;
