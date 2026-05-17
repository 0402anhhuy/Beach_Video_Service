module.exports = (req, res, next) => {
    const role = req.user?.role || 'customer';
    if (role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này.' });
    }
    return next();
};
