const { Router } = require('express');
const router = Router();
const useragent = require('express-useragent');

const causeCtrl = require('../controllers/cause');
const donationCtrl = require('../controllers/donation');
const beaconCtrl = require('../controllers/beacon');
const authorize = require('../middlewares/Auth');
const CauseRequest = require('../models/Requests/Cause');
const DonationRequest = require('../models/Requests/Donation');

router.get('/', async (req, res, next) => {
  try {
    res.json( await causeCtrl.find(req.query) );
  } catch (err) {
    next(err);
  }
});

router.get('/my-causes', authorize(), async (req, res, next) => {
  try {
    const causes = await causeCtrl.findMyCauses({ user: req.user });

    const promises = await causes.map(async (cause) => ({
      ...cause,
      analytics: await beaconCtrl.getCauseAnalytics(cause._id, { total: true })
    }));

    res.json( await Promise.all(promises) );
  } catch (err) {
    next(err);
  }
});

router.post('/', authorize(), async (req, res, next) => {
  try {
    const data = await CauseRequest.Create.validate(req.body);
    res.json(await causeCtrl.create(data, req.user));
  } catch (err) {
    next(err);
  }
});

router.get('/:causeId', async (req, res, next) => {
  try {
    res.json(await causeCtrl.get(req.params.causeId));
  } catch (err) {
    next(err);
  }
});

router.patch('/:causeId', authorize(), async (req, res, next) => {
  try {
    const data = await CauseRequest.Update.validate(req.body);
    res.json(await causeCtrl.update(req.params.causeId, data));
  } catch (err) {
    next(err);
  }
});

router.delete('/:causeId', authorize(), async (req, res, next) => {
  try {
    res.json( await causeCtrl.delete(req.params.causeId, req.user) );
  } catch (err) {
    next(err);
  }
});

router.post('/:causeId/donation', async (req, res, next) => {
  try {
    const data = await DonationRequest.Create.validate(req.body);
    data.cause = req.params.causeId;
    res.json(await donationCtrl.create(data, req.user));
  } catch (err) {
    next(err);
  }
});


module.exports = router;
