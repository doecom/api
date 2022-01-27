const Notification = require('../models/Notification');

const create = (data) => {
  return Notification.create(data);
};

const getAll = ({ page = 1, size = 10, filters = {} } = {}) => {

  const notification = Notification
    .find(filters)
    .sort({
      createdAt: -1
    })
    .lean();

  return paginate(notification, { page, size });
};

const get = (_id) => {
  const options = {
    _id
  };

  return Notification
    .findOne(options)
    .lean();
};

const update = (_id, data) => {
  const options = {
    _id
  };

  return Notification
    .findOneAndUpdate(
      options,
      data,
      { new: true, useFindAndModify: false }
    );
};

module.exports = {
  create,
  getAll,
  get,
  update
}
