const bcrypt = require('bcrypt');

const User = require('../models/User');

const { escapeStringRegexp } = require('../helpers/functions');
const { paginate } = require('../helpers/paginate');

const create = async (data) => {
  const user = User(data);
  user.password = await bcrypt.hash(user.password, 5);
  user.roles.push('profile');
  user.phoneNumber = data.phoneNumber ? data.phoneNumber.match(/\d+/g).join('') : '';
  await user.save();
  user.password = undefined;
  return user;
};

const getAll = ({ page = 1, size = 10, email = '', name = '' } = {}) => {
  const options = {
    active: true,
    email: new RegExp(escapeStringRegexp(email), 'ig'),
    name: new RegExp(escapeStringRegexp(name), 'ig')
  };

  const users = User
    .find(options)
    .sort({
      createdAt: -1
    })
    .select('-password')
    .lean();

  return paginate(users, { page, size });
};

const get = (_id) => {
  const options = {
    active: true,
    _id
  };

  return User
    .findOne(options)
    .select('-password')
    .lean();
};

const update = async (_id, data) => {
  try {
    const options = {
      active: true,
      _id
    };

    if (data.password && data.password.length) {
      data.password = await bcrypt.hash(data.password, 5);
    } else {
      delete data.password;
    }

    if (data.phoneNumber && data.password.length) {
      data.phoneNumber = data.phoneNumber.match(/\d+/g).join('');
    } else {
      delete data.phoneNumber;
    }

    return User
      .findOneAndUpdate(
        options,
        data,
        { new: true, useFindAndModify: false }
      )
      .select('-password');
  } catch (err) {
    throw err;
  }
};

const remove = (_id) => {
  const options = {
    active: true,
    _id
  };

  return User
    .findOneAndUpdate(
      options,
      { active: false },
      { new: true, useFindAndModify: false }
    )
    .select('-password');
};

const find = (filters = {}) => {
  return User.findOne({ ...filters, active: true }).lean();
};

const checkPassword = (user, password) => {
  return bcrypt.compare(password, user.password);
};

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
  checkPassword,
  find
}
