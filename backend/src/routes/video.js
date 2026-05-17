const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authMiddleware = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { listMyVideos, uploadVideoForCustomer, streamOrDownloadVideo } = require('../controllers/videoController');

const uploadsRoot = path.join(__dirname, '..', '..', 'uploads');
const videosDir = path.join(uploadsRoot, 'videos');

if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot);
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, videosDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || '');
        const safeExt = ext && ext.length <= 10 ? ext : '';
        const rand = Math.random().toString(16).slice(2);
        cb(null, `video_${Date.now()}_${rand}${safeExt}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype || !file.mimetype.startsWith('video/')) {
            return cb(new Error('Chỉ chấp nhận file video.'));
        }
        cb(null, true);
    }
});

router.get('/my', authMiddleware, listMyVideos);
router.get('/:id/stream', authMiddleware, streamOrDownloadVideo);
router.post('/upload', authMiddleware, requireAdmin, upload.single('video'), uploadVideoForCustomer);

module.exports = router;
