const jsonwebtoken = require('jsonwebtoken');
const geoip = require('geoip-lite');

const userCrtl = require('./user');
const AuthError = require('../helpers/Errors/AuthError');
const { AUTH } = require('../helpers/constants');
const Session = require('../models/Session');

const { SECRET } = process.env;

const login = async (email, password, userAgent, ip) => {
  const user = await userCrtl.find({ email });
  if (!user) throw new AuthError(AUTH.NOT_FOUND_OR_WRONG_PWD);
  const session = newSession(user, userAgent, ip);
  const passwordMatch = await userCrtl.checkPassword(user, password);
  if (!passwordMatch) {
    await session.save();
    throw new AuthError(AUTH.NOT_FOUND_OR_WRONG_PWD)
  };
  await userCrtl.update(user._id, { lastLogin: new Date(), $inc: { loginCount: 1 } });
  const accessToken = await createToken(user, session);
  const { exp } = jsonwebtoken.decode(accessToken);
  const access = {
    user: `${user._id}`,
    accessToken,
    expiresIn: exp,
    tokenType: 'Bearer',
    roles: user.roles.join(',')
  };
  session.tokenType = access.tokenType;
  session.success = true;
  session.active = true;
  await session.save();
  return access;
};

const createToken = (user, session) => {
  return jsonwebtoken.sign({
    roles: user.roles.join(','),
    sid: session._id
  },
    SECRET,
    {
      subject: `${user._id}`,
      expiresIn: '30d'
    });
};

const checkCredentials = async (authorization, role) => {
  try {
    const [type, token] = authorization.split(' ');
    if (type.toLowerCase() !== 'bearer') throw new AuthError(AUTH.WRONG_AUTHORIZATION_TYPE, 403);

    const payload = await jsonwebtoken.verify(token, SECRET);
    if (!payload) throw new AuthError(AUTH.INVALID_AUTHORIZATION, 403);

    const user = await userCrtl.find({ _id: payload.sub });
    if (!user) throw new AuthError(AUTH.INVALID_USER, 401);

    const session = await getActiveSession(payload.sid);
    if (!session) throw new AuthError(AUTH.SESSION_EXPIRED, 401);

    if (role && !user.roles.includes(role)) {
      throw new AuthError(AUTH.ACCESS_DENIED, 401);
    }

    return { user, session };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw new AuthError(AUTH.INVALID_AUTHORIZATION, 403);
  }
};

const newSession = (user, userAgent, ip) => {
  const geo = geoip.lookup(ip) || {};

  let uaType = 'BOT';
  if (userAgent.isMobile) {
    uaType = 'MOBILE'
  } else if (userAgent.isDesktop) {
    uaType = 'DESKTOP'
  }

  return new Session({
    user,
    userAgent: {
      platform: userAgent.platform === 'unknown' ? null : userAgent.platform,
      os: userAgent.os === 'unknown' ? null : userAgent.os,
      browser: userAgent.browser === 'unknown' ? null : userAgent.browser,
      browserVersion: userAgent.version === 'unknown' ? null : userAgent.version,
      device: uaType,
      raw: userAgent.source
    },
    location: {
      city: geo.city || null,
      region: geo.region || null,
      country: geo.country || null,
      ip
    },
    active: false,
    success: false
  });
};

const getActiveSession = (sessionId) => {
  return Session.findOne({ _id: sessionId, active: true });
};

const getSessions = async (user, currentSession) => {
  const sessions = await Session.find({ user }).sort({ createdAt: -1 }).limit(10).lean();
  if (!sessions) return sessions;
  return sessions.map(session => ({...session, current: session._id.toString() === currentSession._id.toString() }));
};

const terminateSessions = async (user, sessions) => {
  await Session.updateMany({
    active: true,
    user: user
  }, { active: false })
    .where('_id')
    .in(sessions);
  return { message: 'ok' };
};

const logout = async (user, currentSession) => {
  return terminateSessions(user, [currentSession]);
};

module.exports = {
  login,
  checkCredentials,
  logout,
  terminateSessions,
  getSessions
};
