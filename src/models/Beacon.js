const { Schema, model, models } = require('mongoose');

const BeaconSchema = new Schema({
  uCId: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    default: null,
  },
  event: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  params: {
    type: String,
    default: null,
  },
  ip: {
    type: String,
    default: ''
  },
  referrer: {
    type: String,
    default: ''
  }
},
  { timestamps: true }
);

module.exports = models.BeaconSchema || model('Beacon', BeaconSchema);
