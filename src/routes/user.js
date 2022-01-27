const { Router } = require('express');
const router = Router();

const userCtrl = require('../controllers/user');
const authorize = require('../middlewares/Auth');
const UserRequest = require('../models/Requests/User');

router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const data = await UserRequest.validate(req.body);
    res.json( await userCtrl.create(data));
  } catch (err) {
    next(err);
  }
});

router.get('/', authorize('admin'), async (req, res, next) => {
  try {
    res.json( await userCtrl.getAll(req.query) );
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authorize('admin'), async (req, res, next) => {
  try {
    res.json( await userCtrl.get(req.params.id) );
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authorize('admin'), async (req, res, next) => {
  try {
    res.json( await userCtrl.update(req.params.id, req.body) );
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    res.json( await userCtrl.remove(req.params.id) );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
