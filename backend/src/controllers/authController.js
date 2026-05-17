const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Verification = require('../models/Verification');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendOTPEmail = async (to, otp, subject) => {
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 10 phút.`
    });
};

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const createVerification = async ({ name, email, password, type }) => {
    await Verification.destroy({ where: { email, type } });
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await Verification.create({ name, email, password, otpHash, expiresAt, type });
    return otp;
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Vui lòng cung cấp tên, email và mật khẩu.' });

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ message: 'Email đã được đăng ký.' });

        const passwordHash = await bcrypt.hash(password, 10);
        const otp = await createVerification({ name, email, password: passwordHash, type: 'register' });

        try {
            await sendOTPEmail(email, otp, 'Mã OTP xác thực đăng ký');
        } catch {
            return res.status(500).json({ message: 'Không thể gửi email OTP.' });
        }

        return res.json({ message: 'OTP đã được gửi tới email. Vui lòng kiểm tra hộp thư.' });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const verify = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Vui lòng cung cấp email và mã OTP.' });

        const pending = await Verification.findOne({ where: { email, type: 'register' } });
        if (!pending) return res.status(400).json({ message: 'Không tìm thấy yêu cầu đăng ký.' });

        if (new Date() > new Date(pending.expiresAt)) {
            await pending.destroy();
            return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
        }

        const match = await bcrypt.compare(otp, pending.otpHash);
        if (!match) return res.status(400).json({ message: 'Mã OTP không đúng.' });

        const user = await User.create({ name: pending.name, email: pending.email, password: pending.password, role: 'customer' });
        await pending.destroy();

        const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

        return res.status(201).json({ token, user: payload });
    } catch (err) {
        console.error('Verify error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });

        const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

        return res.json({ token, user: payload });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Vui lòng cung cấp email.' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'Email không tồn tại trong hệ thống.' });

        const otp = await createVerification({ email, type: 'reset' });

        try {
            await sendOTPEmail(email, otp, 'Mã OTP đặt lại mật khẩu');
        } catch {
            return res.status(500).json({ message: 'Không thể gửi email OTP.' });
        }

        return res.json({ message: 'OTP đã được gửi tới email. Vui lòng kiểm tra hộp thư.' });
    } catch (err) {
        console.error('ForgotPassword error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Vui lòng cung cấp email và mã OTP.' });

        const pending = await Verification.findOne({ where: { email, type: 'reset' } });
        if (!pending) return res.status(400).json({ message: 'Không tìm thấy yêu cầu đặt lại mật khẩu.' });

        if (new Date() > new Date(pending.expiresAt)) {
            await pending.destroy();
            return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
        }

        const match = await bcrypt.compare(otp, pending.otpHash);
        if (!match) return res.status(400).json({ message: 'Mã OTP không đúng.' });

        return res.json({ message: 'OTP hợp lệ.' });
    } catch (err) {
        console.error('VerifyResetOtp error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword)
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });

        const pending = await Verification.findOne({ where: { email, type: 'reset' } });
        if (!pending) return res.status(400).json({ message: 'Không tìm thấy yêu cầu đặt lại mật khẩu.' });

        if (new Date() > new Date(pending.expiresAt)) {
            await pending.destroy();
            return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
        }

        const match = await bcrypt.compare(otp, pending.otpHash);
        if (!match) return res.status(400).json({ message: 'Mã OTP không đúng.' });

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await User.update({ password: passwordHash }, { where: { email } });
        await pending.destroy();

        return res.json({ message: 'Đặt lại mật khẩu thành công.' });
    } catch (err) {
        console.error('ResetPassword error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

module.exports = { register, verify, login, forgotPassword, verifyResetOtp, resetPassword };