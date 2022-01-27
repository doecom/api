const { Router } = require('express');
const router = Router();

const donationCtrl = require('../controllers/donation');
const authorize = require('../middlewares/Auth');
const DonationRequest = require('../models/Requests/Donation');

router.get('/:donationId', async (req, res, next) => {
  try {
    res.json(await donationCtrl.get(req.params.donationId));
  } catch (err) {
    next(err);
  }
});

router.post('/:donationId/rate', async (req, res, next) => {
  try {
    const data = await DonationRequest.Rate.validate(req.body);
    res.json(await donationCtrl.rate(req.params.donationId, data));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
