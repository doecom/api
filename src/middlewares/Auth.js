const RequestError = require('../helpers/Errors/RequestError');
const AuthCtrl = require('../controllers/auth');
const { AUTH } = require('../helpers/constants');

module.exports = (role) =>
  async (req, _, next) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) throw new RequestError(AUTH.AUTHORIZATION_REQUIRED, 400);
      const {user, session} = await AuthCtrl.checkCredentials(authorization, role);
      req.user = user;
      req.session = session;
      next();
    } catch (err) {
      next(err);
    }
  };
