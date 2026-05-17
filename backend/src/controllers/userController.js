const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'role', 'avatar', 'createdAt']
        });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        return res.json({ user });
    } catch (err) {
        console.error('GetProfile error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim())
            return res.status(400).json({ message: 'Tên không được để trống.' });

        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });

        const updates = { name: name.trim() };

        if (req.file) {
            if (user.avatar) {
                const oldPath = path.join(__dirname, '..', '..', 'uploads', 'avatars', path.basename(user.avatar));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updates.avatar = `/uploads/avatars/${req.file.filename}`;
        }

        await user.update(updates);

        return res.json({
            message: 'Cập nhật hồ sơ thành công.',
            user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, createdAt: user.createdAt }
        });
    } catch (err) {
        console.error('UpdateProfile error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

module.exports = { getProfile, updateProfile };