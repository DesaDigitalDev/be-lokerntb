async function validateAdminRole(req, res, next) {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Akses ditolak, memerlukan hak akses ADMIN" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
}

module.exports = validateAdminRole;
