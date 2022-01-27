const Cause = require('../models/Cause');
const Beacon = require('./beacon');

const { filterObject } = require('../helpers/functions');
const CustomErros = require('../helpers/Errors/CustomError');
const { AUTH } = require('../helpers/constants');

module.exports = {
  async get(id) {
    const cause = await Cause
      .findById(id)
      .populate({ path: 'user' })
      .lean();
    cause.user = filterObject(cause.user, ['_id', 'picture', 'verified', 'name', 'email']);
    return cause;
  },

  findOne(filter) {
    filter.active = true;
    filter.deleted = false;
    return Cause.findOne(filter).lean();
  },

  find(filter) {
    const conditions = [];
    conditions.push({ isGlobal: true });

    if (filter.city && filter.state) {
      conditions.push({ city: filter.city, state: filter.state });
      delete filter.city;
      delete filter.state;
    }

    filter.active = true;
    filter.deleted = false;

    return Cause.find(filter).or(conditions).lean();
  },

  findMyCauses(filter) {
    filter.active = true;
    filter.deleted = false;

    return Cause.find(filter).lean();
  },

  async create(document, user) {
    const cause = {
      ...document,
      user
    };
    const result = await Cause.create(cause);
    await Beacon.create(result._id);
    return result;
  },

  async update(id, document) {
    const result = await Cause.findByIdAndUpdate(
      id,
      document,
      {
        useFindAndModify: false,
        new: true
      }
    ).lean();
    return result;
  },

  async delete(id, user) {
    const cause = await this.findOne({ _id: id, deleted: false });
    if (cause.user != user._id.toString()) {
      throw new CustomErros(AUTH.ACCESS_DENIED);
    }

    return await this.update(id, { deleted: true })
  },

};
