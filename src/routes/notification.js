const { Router } = require('express');
const router = Router();

const notificationCtrl = require('../controllers/notification');
const authorize = require('../middlewares/Auth');
const NotificationRequest = require('../models/Requests/Notification');

router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const data = await NotificationRequest.validate(req.body);
    res.json( await notificationCtrl.create(data));
  } catch (err) {
    next(err);
  }
});

router.get('/', authorize('admin'), async (req, res, next) => {
  try {
    res.json( await notificationCtrl.getAll(req.query) );
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authorize('admin'), async (req, res, next) => {
  try {
    res.json( await notificationCtrl.get(req.params.id) );
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authorize('admin'), async (req, res, next) => {
  try {
    res.json( await notificationCtrl.update(req.params.id, req.body) );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
