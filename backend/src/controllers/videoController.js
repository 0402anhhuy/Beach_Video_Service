const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const User = require('../models/User');

const uploadsRoot = path.join(__dirname, '..', '..', 'uploads');
const videosDir = path.join(uploadsRoot, 'videos');

const ensureVideosDir = () => {
    if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot);
    if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);
};

const normalizeVideo = (video) => {
    const plain = video.get ? video.get({ plain: true }) : video;
    return {
        id: plain.id,
        activity: plain.activity,
        capturedAt: plain.capturedAt,
        originalName: plain.originalName,
        mimeType: plain.mimeType,
        sizeBytes: Number(plain.sizeBytes || 0),
        createdAt: plain.createdAt,
        streamEndpoint: `/api/videos/${plain.id}/stream`
    };
};

const listMyVideos = async (req, res) => {
    try {
        const videos = await Video.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        return res.json({ videos: videos.map(normalizeVideo) });
    } catch (err) {
        console.error('ListMyVideos error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const uploadVideoForCustomer = async (req, res) => {
    try {
        ensureVideosDir();

        const { customerEmail, userId, activity, capturedAt } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'Vui lòng chọn file video.' });

        let customer = null;
        if (userId) {
            customer = await User.findByPk(userId);
        } else if (customerEmail) {
            customer = await User.findOne({ where: { email: customerEmail } });
        }

        if (!customer) {
            try {
                fs.unlinkSync(file.path);
            } catch {
                // ignore
            }
            return res.status(404).json({ message: 'Không tìm thấy khách hàng (user).' });
        }

        const created = await Video.create({
            userId: customer.id,
            uploadedById: req.user.id,
            activity: activity || 'other',
            capturedAt: capturedAt ? new Date(capturedAt) : null,
            originalName: file.originalname,
            storedName: path.basename(file.filename),
            mimeType: file.mimetype,
            sizeBytes: file.size
        });

        return res.status(201).json({ message: 'Tải video lên thành công.', video: normalizeVideo(created) });
    } catch (err) {
        console.error('UploadVideo error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const streamOrDownloadVideo = async (req, res) => {
    try {
        const video = await Video.findByPk(req.params.id);
        if (!video) return res.status(404).json({ message: 'Không tìm thấy video.' });

        const role = req.user?.role || 'customer';
        const allowed = role === 'admin' || String(video.userId) === String(req.user.id);
        if (!allowed) return res.status(403).json({ message: 'Bạn không có quyền xem hoặc tải video này.' });

        const filePath = path.join(videosDir, path.basename(video.storedName));
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File video không tồn tại trên server.' });

        if (req.query.download === 'true') {
            return res.download(filePath, video.originalName);
        } else {
            return res.sendFile(filePath);
        }
    } catch (err) {
        console.error('DownloadVideo error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

module.exports = {
    listMyVideos,
    uploadVideoForCustomer,
    streamOrDownloadVideo
};
