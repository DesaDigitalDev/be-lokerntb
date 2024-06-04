const jwt = require('jsonwebtoken');
const config = require('../../config');

class TokenService {
    static generateToken(payload) {
        const token = jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: '7d'});
        return token;
    }

    static verifyToken(token) {
        try {
            const decoded = jwt.verify(token, config.secretKey);
            return { valid: true, decoded };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
}

module.exports = TokenService;
