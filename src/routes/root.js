const atob = require('atob');
const { Router } = require('express');
const router = Router();

const authorize = require('../middlewares/Auth');

const multerUploads = require('../config/multer');
const imageUpload = require('../services/imageUpload');
const beaconCtrl = require('../controllers/beacon');
router.put('/image', authorize(), multerUploads,  async (req, res) => {
  const link = await imageUpload(req.file.buffer);
  res.json({ link });
});

router.post('/a', async (req, res, next) => {
  try {
    const rawBeacon = atob(req.body.r);
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
    // beacon, pageId
    const { b, p } = JSON.parse(rawBeacon);
    await beaconCtrl.addBeacon(b, p, ip);
    res.json({ message: 'ok' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
