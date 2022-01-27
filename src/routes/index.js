
const user = require('./user');
const account = require('./account');
const notification = require('./notification');
const cause = require('./cause');
const donation = require('./donation');
const locale = require('./locale');
const root = require('./root');

const router = (app) => {

  app.get('/', (_, res) => {
    res.json({ message: 'Hello!' });
  });

  app.use('/', root);
  app.use('/users', user);
  app.use('/account', account);
  app.use('/notifications', notification);
  app.use('/causes', cause);
  app.use('/donations', donation);
  app.use('/locales', locale);

}

module.exports = router;
