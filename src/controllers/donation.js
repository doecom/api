const Donation = require('../models/Donation');
const Cause = require('../models/Cause');
const Beacon = require('./beacon');

module.exports = {
  async get(id) {
    const donation = await Donation
      .findById(id)
      .populate({ path: 'cause' })
      .lean();
    return donation;
  },

  findOne(filter) {
    return Donation.findOne(filter).lean();
  },

  find(filter) {
    return Donation.find(filter).lean();
  },

  async create(document, user = null) {
    const donation = {
      ...document,
      user
    };
    const result = await Donation.create(donation);
    return result;
  },

  async update(id, document) {
    const result = await Donation.findByIdAndUpdate(
      id,
      document,
      {
        useFindAndModify: false,
        new: true
      }
    ).lean();
    return result;
  },

  async rate(id, document) {
    const body = { feedback: document };

    if (document.confirmed) {
      body.confirmed = true;
    }

    const result = await Donation.findByIdAndUpdate(
      id,
      body,
      {
        useFindAndModify: false,
        new: true
      }
    ).lean();
    return result;
  },

};
