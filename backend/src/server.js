require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { connection, sequelize } = require('./config/database');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const uploadsRoot = path.join(__dirname, '..', 'uploads');
const avatarsDir = path.join(uploadsRoot, 'avatars');
const videosDir = path.join(uploadsRoot, 'videos');

if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot);
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir);
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);

// Chỉ public avatar; video tải qua API có auth
app.use('/uploads/avatars', express.static(avatarsDir));

require('./models/Verification');
require('./models/Video');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/videos', require('./routes/video'));

const PORT = process.env.PORT || 3000;

const ensureAdminUser = async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASS;
    if (!email || !password) return;

    const existing = await User.findOne({ where: { email } });
    if (existing) return;

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
        name: 'Admin',
        email,
        password: passwordHash,
        role: 'admin'
    });
    console.log('>>> Đã tạo tài khoản admin từ .env');
};

const start = async () => {
    try {
        await connection();
        await sequelize.sync({ alter: true });
        await ensureAdminUser();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Server start error:', err);
        process.exit(1);
    }
};

start();