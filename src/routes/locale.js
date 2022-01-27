const { Router } = require('express');
const router = Router();
const useragent = require('express-useragent');

const localeCtrl = require('../controllers/locale');

router.get('/', useragent.express(), async (req, res, next) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
    res.json( await localeCtrl.getLocation(ip) );
  } catch (err) {
    next(err);
  }
});

router.get('/states/:state/cities', async (req, res, next) => {
  try {
    res.json( await localeCtrl.getAllCitiesByState({ state: req.params.state }) );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
