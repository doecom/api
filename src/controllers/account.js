const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');

const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');
const mailService = require('../services/mail');
const CustomErros = require('../helpers/Errors/CustomError');
const { filterObject } = require('../helpers/functions');
const { ACCOUNT } = require('../helpers/constants');
const config = require('../config/email');

const {
  HOME_PAGE_URL,
  SIGNING_KEY,
  EMAIL_ADDR,
  EMAIL_NAME,
  RESET_PASS_URL,
  VERIFY_ACC_URL
} = process.env;

const login = ({ email, password }, userAgent, ip) => authCtrl.login(email, password, userAgent, ip);

const logout = (user, token) => authCtrl.logout(user, token);

const sessions = (user, currentSession) => authCtrl.getSessions(user, currentSession);

const terminateSessions = (user, sessions) => authCtrl.terminateSessions(user, sessions);

const profile = async ({ _id }) => {
  const user = await userCtrl.get(_id);
  return { ...user };
};

const register = async (data) => {
  try {
    const user = await userCtrl.create(data);
    await verificationEmail(user);
    return user;
  } catch (err) {
    throw err;
  }
};

const genVerifToken = ({ payload, expiresIn = '1d' } = {}) => {
  return jsonwebtoken.sign(
    payload,
    SIGNING_KEY,
    { expiresIn }
  );
};

const verificationEmail = async (user, isResend = false) => {
  try {
    const token = genVerifToken({ payload: { user: user._id }, expiresIn: '1d' });
    const mail = {
      from: `${EMAIL_NAME} <${EMAIL_ADDR}>`,
      to: user.email,
      subject: config.verificationEmail[user.language].subject
    };
    const variables = {
      name: user.name.split(' ')[0],
      buttonUrl: `${VERIFY_ACC_URL}?token=${token}`,
      poweredByUrl: HOME_PAGE_URL,
      year: moment().format('YYYY')
    };
    await mailService.send(isResend ? 'verifyAccount' : 'newAccount', mail, variables, { language: user.language });
    return { message: 'ok' };
  } catch (err) {
    throw err;
  }
};

const verifyAccount = async ({ token }) => {
  try {
    const payload = jsonwebtoken.verify(token, SIGNING_KEY);
    await userCtrl.update(payload.user, { verified: true });
    return { message: 'Account verified' };
  } catch (_) {
    throw new CustomErros(ACCOUNT.INVALID_VERIFICATION_CODE);
  }
};

const update = (user, data) => {
  const allowedFields = [
    'name', 'picture', 'email', 'password', 'phoneNumber', 'city', 'state'
  ];
  return userCtrl.update(user._id, filterObject(data, allowedFields));
};

const resetPasswordRequest = async ({ email }) => {
  try {
    const message = { message: 'Check your email' };
    const user = await userCtrl.find({ email });
    if (!user) return message;
    await resetPasswordEmail(user);
    return message;
  } catch (err) {
    throw err;
  }
};

const resetPasswordEmail = async (user) => {
  try {
    const token = genVerifToken({ payload: { user: user._id }, expiresIn: '1h' });
    const mail = {
      from: `${EMAIL_NAME} <${EMAIL_ADDR}>`,
      to: user.email,
      subject: config.resetPasswordEmail[user.language].subject
    };
    const variables = {
      name: user.name.split(' ')[0],
      buttonUrl: `${RESET_PASS_URL}?token=${token}`,
      poweredByUrl: HOME_PAGE_URL,
      year: moment().format('YYYY')
    };
    await mailService.send('resetPassword', mail, variables, { language: user.language });
  } catch (err) {
    throw err;
  }
};

const resetPassword = async ({ token, password }) => {
  try {
    const payload = jsonwebtoken.verify(token, SIGNING_KEY);
    await userCtrl.update(payload.user, { password });
    return { message: 'Password changed' };
  } catch (_) {
    throw new CustomErros(ACCOUNT.INVALID_RESET_PASSWORD_CODE);
  }
};

module.exports = {
  login,
  register,
  profile,
  verifyAccount,
  update,
  resetPasswordRequest,
  resetPassword,
  genVerifToken,
  logout,
  sessions,
  terminateSessions,
  verificationEmail
};
